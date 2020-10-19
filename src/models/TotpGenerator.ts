import { Service } from "./Service";
import { totp as totpLib } from 'otplib';
import * as Crypto from 'expo-crypto';

const REFRESH_DELAY_IN_MS = 1000;

export class TotpGenerator {
    private token: string;
    private last_generation_at: Date;

    constructor(
        private service: Service,
        private tickCallback: (token: string, delay: number) => void
    ) {
        // Generator options
        totpLib.options = {
            digits: this.service.digits,
            step: this.service.periodInSec,
            crypto: Crypto
        };

        setInterval(() => { this.tick() }, REFRESH_DELAY_IN_MS);
    }

    /**
     * Triggered every seconds to regenerate token
     * if necessary, and send info to view
     */
    private async tick(): Promise<void>
    {
        if (this.is_new_generation_needed)
            await this.generateToken();
        this.tickCallback(this.token, this.remaining_delay_in_sec_before_expiration);
    }

    /**
     * Generate new TOTP token
     */
    private async generateToken(): Promise<void> {
        this.last_generation_at = new Date();
        this.token = totpLib.generate(this.service.secret);
    }

    /**
     * Determine if current token is expired and
     * new generation is needed
     */
    private get is_new_generation_needed(): boolean {
        if (!this.last_generation_at) return true;
        if (this.remaining_delay_in_sec_before_expiration < 0)
            return true;
        return false;
    }

    /**
     * Delay in seconds since last token generation
     * (1000000 if token never generated)
     */
    private get delay_in_sec_since_generation(): number {
        if (!this.last_generation_at) return 1000000;
        return Math.round((new Date().getTime() - this.last_generation_at.getTime()) / 1000);
    }

    /**
     * Remaining delay in seconds before token expiration
     */
    private get remaining_delay_in_sec_before_expiration(): number {
        return this.service.periodInSec - this.delay_in_sec_since_generation;
    }
}