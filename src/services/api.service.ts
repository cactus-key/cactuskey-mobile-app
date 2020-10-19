import {API_ORIGIN} from '../../config';
import Store from '../store/configure_store';
import { Updates } from 'expo';

export const apiGet = (path: string, expected_code?: number) => {
    return request({
        method: 'GET',
        path,
        expected_code
    });
}

export const apiPost = (path: string, body: any = {}, expected_code?: number) => {
    return request({
        method: 'POST',
        path,
        body,
        expected_code
    });
}

export const apiPostFormData = (path: string, body: any = {}, expected_code?: number) => {
    return new Promise((resolve, reject) => {
        try {
            let formData = new FormData();

            // Append each data to formData
            for(const key in body) {
                formData.append(key, body[key]);
            }

            request({
                method: 'POST',
                path,
                body: formData,
                is_form_data: true,
                expected_code
            }).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        } catch (error) {
            reject(error);
        }
    });
}

export const apiPatch = (path: string, body: any = {}, expected_code?: number) => {
    return request({
        method: 'PATCH',
        path,
        body,
        expected_code
    });
}

export const apiDelete = (path: string, expected_code?: number) => {
    return request({
        method: 'DELETE',
        path,
        expected_code
    });
}

export const request = (params: {method: string; path: string; body?: any; expected_code?: number, is_form_data?: boolean, ignore_unauthenticated?: boolean}) => {
    // Create headers
    let headers = {
        'Accept': 'application/json',
        'Content-Type': (params.is_form_data ? 'multipart/form-data' : 'application/json')
    };

    // Load & append JWT auth token from Redux
    const state = Store.getState();
    const auth_token = state.auth.token;
    if(auth_token !== undefined) {
        headers['Authorization'] = `Bearer ${auth_token}`;
    }

    // Building request parameters
    // If formdata, append raw
    let p = {method: params.method, headers};
    if(params.method == 'POST' || params.method == 'PATCH') {
        p['body'] = (params.is_form_data ? params.body : JSON.stringify(params.body));
    }

    // Rend request
    return new Promise((resolve, reject) => {
        try {
            fetch(API_ORIGIN + params.path, p).then((res) => {
                res.json().then((json) => {
                    const data = {status: res.status, json};
                    console.log(data);

                    // Check if unauthenticated
                    if(!params.ignore_unauthenticated && data.status == 401 && data.json.message === "Unauthenticated.") {
                        // Restart app
                        return Store.getStore().dispatch({ type: "OPEN_AUTH_MODAL" });
                    }

                    // Check if blocked
                    if(!params.ignore_unauthenticated && data.status == 403 && data.json.error === "Blocked user") {
                        // Restart app
                        return Updates.reload();
                    }

                    // Check expected code
                    if(params.expected_code && params.expected_code != data.status) {
                        return reject(data);
                    }

                    resolve(data);
                });
            }).catch((err) => {
                reject(err);
            });
        } catch(e) {
            console.error({myerror: e});
        }
    });
}