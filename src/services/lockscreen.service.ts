import { AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import uuid from 'react-native-uuid';

type LockCallback = (is_locked: boolean) => void;
type BiometricEnabledCallback = (is_enabled: boolean) => void;

export class LockscreenService {

    // Singleton
    private static instance: LockscreenService = null;
    static getInstance(): LockscreenService {
        if (LockscreenService.instance === null)
            LockscreenService.instance = new LockscreenService();
        return LockscreenService.instance;
    }

    /**
     * Define index.tsx state by providing is_locked boolean
     */
    private setIsLocked: LockCallback;
    setLockCallback(callback: LockCallback): void {
        this.setIsLocked = callback;
    }

    /**
     * Define Lockscreen/PasscodeScene is_biometric_enabled state
     * by providing is_enabled boolean
     */
    private setIsBiometricEnabled: BiometricEnabledCallback;
    setBiometricEnabledCallback(callback: BiometricEnabledCallback): void {
        this.setIsBiometricEnabled = callback;
    }

    /**
     * Initialize lockscreen
     */
    async init(): Promise<void> {
        AppState.addEventListener('change', this.onAppStateChange);
        this.setIsLocked(await this.isEnabledAsync());
        this.setIsBiometricEnabled(await this.isBiometricEnabledAsync());
        // this.setPasscode('1234');
    }

    /**
     * Triggered when app state change
     * see https://docs.expo.io/versions/v36.0.0/react-native/appstate/
     * @param state 
     */
    onAppStateChange = (state: 'active' | 'background' | 'inactive'): void => {
        if (state !== 'active') this.lockIfEnabled();
    }

    /**
     * Determine if lockscreen is enabled of not
     */
    async isEnabledAsync(): Promise<boolean> {
        return (await SecureStore.getItemAsync('lock.passcode')) !== null;
    }

    /**
     * Determine if biometric unlocking is enabled of not
     */
    async isBiometricEnabledAsync(): Promise<boolean> {
        return (await SecureStore.getItemAsync('lock.is_biometric_enabled')) === 'true';
    }

    /**
     * Lock application
     */
    lock(): void {
        this.setIsLocked(true);
    }

    /**
     * Lock application
     */
    lockIfEnabled(): void {
        this.isEnabledAsync().then(is_enabled => {
            if (is_enabled) this.lock();
        });
    }

    /**
     * Unlock application by providing passcode
     * @param entered_passcode 
     */
    async unlock(entered_passcode: string): Promise<boolean> {
        // Fetch salt & real hash from SecureStore
        const real_hashed_passcode = await SecureStore.getItemAsync('lock.passcode');
        if (real_hashed_passcode !== null) {

            // Split salt and hash
            const parts = real_hashed_passcode.split(".", 2);
            const salt = parts[0], real_hash = parts[1];

            // Hash entered passcode
            const entered_hash = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                `${salt}.${entered_passcode}`
            );

            // Compare hashes
            if (entered_hash !== real_hash) return false;

        }

        // Unlock app
        this.setIsLocked(false);
        return true;
    }

    /**
     * Unlock application with biometry
     */
    async unlockBiometric(): Promise<boolean> {
        if (!(await this.isBiometricEnabledAsync())) return false;

        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) this.setIsLocked(false);
        return result.success;
    }

    /**
     * Define a new passcode for application
     * @param passcode 
     */
    async setPasscode(passcode: string): Promise<void> {
        // Generate random salt
        const salt = `${uuid.v4()}`;

        // Hash passcode with salt
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `${salt}.${passcode}`
        );

        // Store salt & hash to SecureStore
        await SecureStore.setItemAsync('lock.passcode', `${salt}.${hash}`);
    }

    /**
     * Enable biometric support for lockscreen
     */
    async enableBiometric(): Promise<void> {
        await SecureStore.setItemAsync('lock.is_biometric_enabled', 'true');
        this.setIsBiometricEnabled(true);
    }

    /**
     * Disable biometric support for lockscreen
     */
    async disableBiometric(): Promise<void> {
        await SecureStore.setItemAsync('lock.is_biometric_enabled', 'false');
        this.setIsBiometricEnabled(false);
    }

    /**
     * Disable lockscreen for application
     */
    async disable(): Promise<void> {
        await SecureStore.deleteItemAsync('lock.passcode');
        await SecureStore.deleteItemAsync('lock.is_biometric_enabled');
    }

}
