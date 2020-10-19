import { Issuer } from "./Issuer";

export class Service {
    constructor(
        private _label: string,
        private _issuer: Issuer,
        private _secret: string,
        private _periodInSec: number = 30,
        private _digits: number = 6
    ) {}

    get label(): string { return this._label; }
    get issuer(): Issuer { return this._issuer; }
    get secret(): string { return this._secret; }
    get periodInSec(): number { return this._periodInSec; }
    get digits(): number { return this._digits; }
}
