export class Profile {
    constructor(public id: number,
                public name: string,
                public avatar_url: string,
                public is_private: boolean,
                public is_follow_accepted: boolean,
                public is_pending_follow_request: boolean,
                public created_at: Date) {}
}
