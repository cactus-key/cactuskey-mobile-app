import * as SecureStore from 'expo-secure-store';
import { Service } from './Service';

/**
 * Secure store to save services on user phone
 * see: https://docs.expo.io/versions/latest/sdk/securestore/
 */
export class ServiceStore {

    private static instance: ServiceStore = null;
    private is_loaded: boolean;
    private services: Service[];

    static getInstance() {
        if (ServiceStore.instance == null) {
            ServiceStore.instance = new ServiceStore();
        }

        return this.instance;
    }

    constructor() {
        this.is_loaded = false;
        this.services = [];
    }

    /**
     * Fetch all services from secure store
     */
    async fetchAll(): Promise<Service[]> {
        if (!this.is_loaded) await this._load_index();

        // Clone list
        const services = [];
        for (const service of this.services) services.push(service);
        return services;
    }

    /**
     * Fetch service by uuid from secure store
     * @param uuid 
     */
    async fetch(uuid: string): Promise<Service> {
        if (!this.is_loaded) await this._load_index();
        for (const service of this.services) {
            if (service.uuid === uuid) return service;
        }
        return null;
    }

    /**
     * Store service into secure store
     * @param service 
     */
    async store(service: Service): Promise<void> {
        if (!this.is_loaded) await this._load_index();

        // Store service data in a safe place
        await SecureStore.setItemAsync(`services.item.${service.uuid}`, service.uri);

        // Append to list
        if (!this.services.includes(service)) {
            this.services.push(service);
            await this._write_index();
        }
    }

    /**
     * Remove service from secure store
     * @param service 
     */
    async remove(service: Service): Promise<void> {
        if (!this.is_loaded) await this._load_index();
        // Delete service secure data
        await SecureStore.deleteItemAsync(`services.item.${service.uuid}`);

        // Rewrite paginations
        const index = this.services.indexOf(service);
        if (index >= 0) {
            this.services.splice(index, 1);
            await this._write_index();
        }
    }

    private async _load_index(): Promise<void> {
        let pages_count = parseInt(await SecureStore.getItemAsync('services.index'));
        if (isNaN(pages_count)) pages_count = 0;

        if (pages_count === 0) {
            await this._write_index();
            this.is_loaded = true;
            return;
        }

        // Fetch all service uuids
        this.services = [];
        for (let i = 0; i < pages_count; i++)
        {
            try {
                const uuid = await SecureStore.getItemAsync(`services.index.${i}`);
                if (uuid === null) throw new Error(`Empty index @ ${i}`);
                const uri = await SecureStore.getItemAsync(`services.item.${uuid}`);
                if (uri === null) throw new Error(`Service not found @ ${uuid}`);
                this.services.push(new Service(uri, uuid));
            } catch (error) {
                console.log('Unable to split page');
            }
        }

        await this._write_index();
        this.is_loaded = true;
    }

    private async _write_index() {
        // Fetch all service uuids
        const uuids = this.services.map((service) => service.uuid);

        for (let i = 0; i < uuids.length; i++) {
            await SecureStore.setItemAsync(`services.index.${i}`, uuids[i]);
        }

        // Write pages count
        await SecureStore.setItemAsync(`services.index`, `${uuids.length}`);
    }

    // private async _dump() {
    //     console.log('----------- SECURE_STORE ------------');
    //     const index_count = parseInt(await SecureStore.getItemAsync('services.index'));
    //     console.log('| services.index:', index_count);
    //     if (!isNaN(index_count)) {
    //         for (let i = 0; i < index_count; i++) {
    //             console.log(`| services.index.${i}`, await SecureStore.getItemAsync(`services.index.${i}`));
    //         }
    //     }
    //     console.log('----------- SECURE_STORE ------------');
    // }

}
