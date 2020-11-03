import { Issuer, ISSUERS } from '../constants/issuers.constant';
import i18n from '../../i18n';

export class IssuersService {

    // Singleton
    private static instance: IssuersService = null;
    static getInstance(): IssuersService {
        if (IssuersService.instance === null)
            IssuersService.instance = new IssuersService();
        return IssuersService.instance;
    }

    private issuers_by_key: any;

    constructor() {
        // Map issuers to name and aliases
        this.issuers_by_key = {};
        for (const issuer of ISSUERS) {
            this.issuers_by_key[issuer.key] = issuer;
            for (const key_alias of issuer.key_aliases) {
                this.issuers_by_key[key_alias] = issuer;
            }
        }
    }

    /**
     * Fetch all issuers
     */
    fetchAll(): Issuer[] {
        return ISSUERS;
    }

    /**
     * Fetch issuer by key. If not found, return default issuer
     * @param key 
     */
    fetchByKey(key: string): Issuer  {
        return this.issuers_by_key[key] || this.defaultIssuer;
    }

    /**
     * Get default issuer if no other one select
     */
    get defaultIssuer(): Issuer {
        return {
            name: `(${i18n.t('common.other')})`,
            key: "_default",
            key_aliases: [],
            icon: require("../assets/issuers/_default.png"),
            is_default: true
        };
    }

}