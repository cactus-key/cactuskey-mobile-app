import { apiGet, apiPost, apiDelete } from './api.service';

const LIMIT_COUNT: number = 20;

export const apiGetComments = (post_id: number) => {
    return apiGet('/posts/' + post_id + '/comments/' + LIMIT_COUNT, 200);
}

export const apiGetCommentsBefore = (post_id: number, comment_id: number) => {
    return apiGet('/posts/' + post_id + '/comments/' + LIMIT_COUNT + '/before/' + comment_id, 200);
}

export const apiCreateComment = (post_id: number, text: string) => {
    return apiPost('/posts/' + post_id + '/comments', {text}, 200);
}

export const apiDeleteComment = (post_id: number, comment_id: number) => {
    return apiDelete('/posts/' + post_id + '/comments/c/' + comment_id, 200);
}