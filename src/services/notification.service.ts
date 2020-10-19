import { apiGet } from './api.service';

const LIMIT_COUNT: number = 20;

export const apiGetNotifications = () => {
    return apiGet('/notifications/' + LIMIT_COUNT, 200);
}

export const apiGetNotificationsBefore = (notif_id: number) => {
    if(notif_id === null) return apiGetNotifications();
    return apiGet('/notifications/' + LIMIT_COUNT + '/before/' + notif_id, 200);
}

export const apiGetNotificationsAfter = (notif_id: number) => {
    if(notif_id === null) return apiGetNotifications();
    return apiGet('/notifications/' + LIMIT_COUNT + '/after/' + notif_id, 200);
}