global.Buffer = global.Buffer || require('buffer').Buffer;

import * as OTPAuth from 'otpauth';
import { totpToken, totpOptions, totpTimeRemaining } from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import { IssuersService } from '../services/issuers.service';
import { AppConstants } from '../constants/app.constants';
import { Issuer } from '../constants/issuers.constant';
import * as Crypto from 'expo-crypto';
import uuid from 'react-native-uuid';

type OtpType = 'TOTP' | 'HOTP';
type OtpAlgorithm = 'SHA1' | 'SHA256' | 'SHA512';

export class Service {
    private _type: OtpType;
    private _secret: string;
    private _issuer: string;
    private _label: string;
    private _algorithm: OtpAlgorithm;
    private _periodInSec: number;
    private _digits: number;

    constructor(private _uri: string, private _uuid?: string) {
        // Generate UUID if doesn't exists
        this._uuid = _uuid || uuid.v4();

        // Remove 'image' and 'skid' properties
        const parts = this._uri.split('&');
        for (let i = 0; i < parts.length; i++) {
            if (
                parts[i].substr(0, 6) === 'image=' ||
                parts[i].substr(0, 5) === 'skid='
            ) {
                parts.splice(i);
                i--;
            }
        }
        this._uri = parts.join('&');

        // Parse OTPAuth URI with library
        // see https://www.npmjs.com/package/otpauth
        // const data = OTPAuth.URI.parse(_uri);
        const data = OTPAuth.URI.parse(this._uri);

        // Detect OTP type
        this._type = <OtpType> data.constructor.name;
        if (this._type !== 'TOTP') throw new Error("TOTP_ONLY");

        // Store and truncate other parameters
        this._secret = data.secret.hex;
        this._algorithm = <OtpAlgorithm> data.algorithm;
        this._digits = data.digits || 6;
        this._issuer = (data.issuer || '').substr(0, AppConstants.MAX_ISSUER_NAME_LENGTH)
        this._label = (data.label || '').substr(0, AppConstants.MAX_LABEL_LENGTH);
        this._periodInSec = data['period'] || 30; 
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
    get type(): OtpType { return this._type; }
    get algorithm(): OtpAlgorithm { return this._algorithm; }
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
     * Compute service hash to know if it has been updated
     */
    async hash(): Promise<string> {
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            JSON.stringify(this)
        );
    }

    /**
     * Return issuer name
     */
    get issuerName(): any {
        const issuer = this.fetchIssuer();
        return issuer.is_default ? this._issuer : issuer.name;
    }

    /**
     * Return issuer icon from assets/issuers/ folder
     */
    get issuerIcon(): any {
        return this.fetchIssuer().icon;
    }

    /**
     * Fetch issuer from issuers service
     */
    private fetchIssuer(): Issuer {
        return IssuersService.getInstance().fetchByKey(this._issuer);
    }

    /**
     * Regenerate OTPAuth URI according to parameters
     */
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
