import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export const fetchExpoDeviceData = async () => {
    console.log("Asking notifications permission...");
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // only asks if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    // On Android, permissions are granted on app installation, so
    // `askAsync` will never prompt the user

    // Stop here if the user did not grant permissions
    let token = null;
    if (status === 'granted') {
        console.log("Permission granted!");
        console.log("Fetching expo push token...");

        // Get the token that identifies this device
        token = await Notifications.getExpoPushTokenAsync();
    }

    // Determine device type
    let device_type: string;
    if(Constants.platform.ios) {
        device_type = `${Constants.platform.ios.model} ${Constants.deviceYearClass}`;
    } else if(Constants.platform.android) {
        device_type = 'Android';
    } else {
        device_type = 'unknown platform';
    }

    return {
        expo_push_token: token,
        installation_id: Constants.installationId,
        device_type
    };
}