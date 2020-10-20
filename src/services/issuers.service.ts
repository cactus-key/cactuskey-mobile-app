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

    private issuers_by_name: any;

    constructor() {
        // Map issuers to name and aliases
        this.issuers_by_name = {};
        for (const issuer of ISSUERS) {
            this.issuers_by_name[issuer.name] = issuer;
            for (const alias of issuer.aliases) {
                this.issuers_by_name[alias] = issuer;
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
     * Fetch issuer icon by name
     * @param name 
     */
    iconByName(name: string) {
        let issuer: Issuer = this.issuers_by_name[name];
        if (issuer === undefined) issuer = this.defaultIssuer;
        return issuer.icon;
    }

    /**
     * Get default issuer if no other one select
     */
    get defaultIssuer(): Issuer {
        return {
            name: `(${i18n.t('common.other')})`,
            icon: require("../assets/issuers/_default.png"),
            aliases: ["_default"],
            is_default: true
        };
    }

}