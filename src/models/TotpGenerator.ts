import { Service } from "./Service";

const REFRESH_DELAY_IN_MS = 1000;

export class TotpGenerator {
    private refresh_internal: any = null;
    private token: string = null;
    private remaining_time_in_sec: number = 0;

    constructor(
        private service: Service,
        private tickCallback: (token: string, delay: number) => void
    ) {}

    /**
     * Start TOTP generator
     */
    start() {
        if (!this.refresh_internal) {
            this.refresh_internal = setInterval(() => {
                this.tick();
            }, REFRESH_DELAY_IN_MS);
            this.tick();
        }
    }

    /**
     * Stop TOTP generator
     */
    stop() {
        clearInterval(this.refresh_internal);
        this.refresh_internal = null;
    }

    /**
     * Triggered every seconds to regenerate token
     * if necessary, and send info to view
     */
    private async tick(): Promise<void>
    {
        await this.generateToken();
        await this.update_remaining_time();
        this.tickCallback(this.token, this.remaining_time_in_sec);
    }

    /**
     * Generate new TOTP token
     */
    private async generateToken(): Promise<void> {
        this.token = await this.service.generateToken();
    }

    /**
     * Update remaining token time
     */
    private async update_remaining_time(): Promise<void> {
        this.remaining_time_in_sec = await this.service.remainingTime();
    }
}