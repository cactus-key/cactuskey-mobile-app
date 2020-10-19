const sha256 = require('sha256');
import {HK3} from '../../config';
import { request, apiGet, apiPost } from './api.service';

export const authPing = () => {
    return apiGet('/ping', 200);
}

export const authCheckEmail = (email: string) => {
    return apiPost('/check_email', {email});
}

export const authCheckUsername = (username: string) => {
    return apiPost('/check_username', {username});
}

export const authResetPassword = (email: string) => {
    return apiPost('/password_reset', {email}, 200);
}

export const authFullLogin = (email: string, password_h1: string, device_data: any) => {
    // Fetch salt and timesync
    return request({
        method: 'POST',
        path: '/login/full',
        body: {
            email,
            password: password_h1,
            device_data
        },
        ignore_unauthenticated: true
    });
}

export const authLogin = (email: string, password_h2: string, salt: string, server_delta: number, device_data: any) => {
    // Compute current server time
    // Get UNIX timestamp (with delta) in seconds --> modulo 10 seconds
    const server_time = Math.floor((Math.round((new Date().getTime())/1000) + server_delta) / 10);

    // Hash Password
    const token = sha256(`${HK3}${salt}${server_time}`);
    console.log("token", token);

    // Login
    return request({
        method: 'POST',
        path: '/login',
        body: {
            email,
            password: password_h2,
            token,
            device_data
        },
        ignore_unauthenticated: true
    });
}

export const authRegister = (email: string, username: string, password_h1: string, device_data: any) => {
    return apiPost('/register', {
        email, username,
        password: password_h1,
        c_password: password_h1,
        device_data
    });
}

export const authLogout = (installation_id: string) => {
    return apiPost('/logout', {installation_id});
}

// export const authSendCode = (recaptcha_token: string, phone: string) => {
//     return apiPost('/phone_auth/send_code', {recaptcha_token, phone});
// }

// export const authCheckCode = (token: string, code: string) => {
//     return apiPost('/phone_auth/check_code', {token, code});
// }