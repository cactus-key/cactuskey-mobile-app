import * as SecureStore from 'expo-secure-store';
import { ApiService } from "./api.service";
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Service } from '../../models/Service';
import * as Crypto from 'expo-crypto';

export class ApiAuthService {

    /**
     * Signup user into API
     * @param email string
     * @param password string
     */
    public static signup(email: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.request({
                method: 'POST',
                path: '/auth/signup',
                body: { email, password },
                expected_code: 200
            })
            .then(data => resolve())
            .catch(data => {
                if (
                    data.status === 422 &&
                    JSON.stringify(data.json) === '{"email":["The email has already been taken."]}'
                ) {
                    return reject('EMAIL_ALREADY_TAKEN');
                } else {
                    return reject('UNKNOWN_ERROR');
                }
            });
        });
    }

    /**
     * Register new device into API
     * @param email string
     * @param password string
     * @param device_name string
     * @return device_id string
     */
    public static register_device(email: string, password: string, device_name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.request({
                method: 'POST',
                path: '/auth/register-device',
                body: {
                    email,
                    password,
                    device_name: `${device_name}`.substr(0, 64),
                    device_model: `${Device.manufacturer} ${Device.modelName}`.substr(0, 64),
                    device_installation_id: `${Constants.installationId}`.substr(0, 64)
                },
                expected_code: 200
            })
            .then(data => {
                SecureStore.setItemAsync('api.device_id', data.json.id).then(() => {
                    resolve();
                })
            })
            .catch(data => {
                if (data.error) {
                    return reject(data.error);
                } else {
                    return reject('UNKNOWN_ERROR');
                }
            });
        });
    }

    /**
     * Activate new device into API
     * @param activation_token string
     * @return otp_uri string, account_secret string
     */
    public static async activate_device(activation_token: string): Promise<void> {
        const device_id = await SecureStore.getItemAsync('api.device_id');

        return new Promise((resolve, reject) => {
            ApiService.request({
                method: 'POST',
                path: '/auth/activate-device',
                body: {
                    device_id,
                    activation_token
                },
                expected_code: 200
            })
            .then(data => {
                SecureStore.setItemAsync('api.otp_uri', data.json.otp_uri).then(() => {
                    SecureStore.setItemAsync('api.account_secret', data.json.account_secret).then(() => {
                        resolve();
                    });
                });
            })
            .catch(data => {
                if (data.error) {
                    return reject(data.error);
                } else {
                    return reject('UNKNOWN_ERROR');
                }
            });
        });
    }

    /**
     * Login
     */
    public static async login(): Promise<void> {
        const device_id = await SecureStore.getItemAsync('api.device_id');
        const otp_uri = await SecureStore.getItemAsync('api.otp_uri');
        const account_secret = await SecureStore.getItemAsync('api.account_secret');

        // Generate token
        const otp_token = `${(new Service(otp_uri)).generateToken()}`;
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `${account_secret}${otp_token}`
        );

        return new Promise((resolve, reject) => {
            ApiService.request({
                method: 'POST',
                path: '/auth/login',
                body: {
                    device_id,
                    otp_token,
                    hash
                },
                expected_code: 200
            })
            .then(data => {
                ApiService.access_token = data.json.access_token;
                resolve();
            })
            .catch(data => {
                if (data.error) {
                    return reject(data.error);
                } else {
                    return reject('UNKNOWN_ERROR');
                }
            });
        });
    }

    /**
     * Logout
     */
    public static logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Do nothing if no access token
            if (ApiService.access_token === null)
                return resolve();
            
            ApiService.request({
                method: 'DELETE',
                path: '/auth/logout',
                expected_code: 200
            })
            .then(data => {
                ApiService.access_token = null;
                resolve();
            })
            .catch(data => {
                // If already logged out
                if (data.status === 401) {
                    ApiService.access_token = null;
                    return resolve();
                }

                return reject('UNKNOWN_ERROR');
            });
        });
    }

}
