import { apiPost, apiDelete } from './api.service';

export const apiSavePost = (id: number) => {
    return apiPost('/saves/' + id, {}, 200);
}

export const apiUnsavePost = (id: number) => {
    return apiDelete('/saves/' + id, 200);
}