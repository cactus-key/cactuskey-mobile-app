export class Issuer {
    constructor(
        private _name: string
    ) {}

    get name(): string { return this._name; }
}