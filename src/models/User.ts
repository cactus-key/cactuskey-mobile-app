export class User {
    constructor(public id: number,
                public name: string,
                public avatar_url: string,
                public email: string,
                public phone: string,
                public is_private: boolean) {}
}
