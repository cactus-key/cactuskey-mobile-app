global.Buffer = global.Buffer || require('buffer').Buffer;

import * as OTPAuth from 'otpauth';
import { totpToken, totpOptions, totpTimeRemaining } from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import uuid from 'react-native-uuid';
import { ServiceStore } from "./ServiceStore";
import { IssuersService } from '../services/issuers.service';

type OtpAlgorithm = 'SHA1' | 'SHA256' | 'SHA512';

export class Service {
    private _secret: string;
    private _issuer: string;
    private _label: string;
    private _algorithm: OtpAlgorithm;
    private _periodInSec: number;
    private _digits: number;

    constructor(private _uri: string, private _uuid?: string) {
        const data = OTPAuth.URI.parse(_uri);
        this._uuid = _uuid || uuid.v4();
        this._algorithm = <OtpAlgorithm> data.algorithm || 'SHA1';
        this._digits = data.digits || 6;
        this._issuer = data.issuer || '';
        this._label = data.label;
        this._periodInSec = data['period'] || 30;
        this._secret = data.secret.hex;
    }

    static newFromInfo(info: {
        label: string, issuer: string, secret: string
    }): Service {
        const uri = new OTPAuth.TOTP({
            issuer: info.issuer,
            label: info.label,
            secret: info.secret,
            algorithm: 'SHA1',
            digits: 6,
            period: 30
        }).toString();
        return new Service(uri);
    }

    get uuid(): string { return this._uuid; }
    get uri(): string { return this._uri; }
    get label(): string { return this._label; }
    get issuer(): string { return this._issuer; }
    get periodInSec(): number { return this._periodInSec; }
    get digits(): number { return this._digits; }

    set label(value: string) {
        this._label = value;
        this.regenerateUri();
    }

    /**
     * Generate new OTP token
     * @return <string> token
     */
    async generateToken(): Promise<string> {
        return totpToken(
            this._secret,
            totpOptions({
                createDigest,
                encoding: <any> 'hex',
                digits: this._digits,
                step: this._periodInSec,
                algorithm: <any> this._algorithm.toLowerCase()
            })
        );
    }

    /**
     * Return remaining time in seconds
     * for current OTP token
     * @return <number> remaining time
     */
    async remainingTime(): Promise<number> {
        return totpTimeRemaining(Date.now(), this._periodInSec);
    }

    /**
     * Return issuer icon from assets/issuers/ folder
     */
    get issuerIcon(): any {
        return IssuersService.getInstance().iconByName(this.issuer);
    }

    private regenerateUri(): void {
        this._uri = new OTPAuth.TOTP({
            issuer: this._issuer,
            label: this._label,
            algorithm: this._algorithm,
            digits: this._digits,
            period: this._periodInSec,
            secret: OTPAuth.Secret.fromHex(this._secret)
        }).toString();
    }
}
