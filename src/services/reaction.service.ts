import { apiPost, apiDelete } from './api.service';

export const apiPostReact = (post_id: number, type: number) => {
    return apiPost('/posts/' + post_id + '/react/' + type, {}, 200);
}

export const apiPostUnreact = (post_id: number) => {
    return apiDelete('/posts/' + post_id + '/unreact', 200);
}