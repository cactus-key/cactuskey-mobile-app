import { apiGet, apiPost, apiPostFormData, apiDelete } from './api.service';

export const apiGetPost = (id: number) => {
    return apiGet('/posts/' + id, 200);
}

export const apiCreatePost = (img: {uri: string; name: string; type: string;}, text: string = '') => {
    return apiPostFormData('/posts', {
        img, text
    }, 200);
}

export const apiReportPost = (id: number, text: string) => {
    return apiPost('/posts/' + id + '/report', {text}, 200);
}

export const apiDeletePost = (id: number) => {
    return apiDelete('/posts/' + id, 200);
}