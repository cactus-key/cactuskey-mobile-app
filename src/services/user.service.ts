import { apiGet, apiPatch, apiPostFormData, apiDelete } from './api.service';

export const apiGetUser = () => {
    return apiGet('/me', 200);
}

export const apiUpdateUser = (params: any) => {
    return apiPatch('/me', params, 200);
}

export const apiPostAvatar = (uri: string, name: string, type: string) => {
    return apiPostFormData('/me/avatar', {
        'avatar': { uri, name, type }
    }, 200);
}

export const apiDeleteAvatar = () => {
    return apiDelete('/me/avatar', 200);
}