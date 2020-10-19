import { apiGet, apiPost, apiDelete } from './api.service';

export const apiGetProfile = (id: number) => {
    return apiGet('/profiles/' + id, 200);
}

export const apiProfileFollow = (id: number) => {
    return apiPost('/profiles/' + id + '/follows', {}, 200);
}

export const apiProfileUnfollow = (id: number) => {
    return apiDelete('/profiles/' + id + '/follows', 200);
}

export const apiFollowRequestAccept = (id: number) => {
    return apiPost('/profiles/' + id + '/follows/accept', {}, 200);
}

export const apiFollowRequestDecline = (id: number) => {
    return apiDelete('/profiles/' + id + '/follows/decline', 200);
}

const POSTS_LIMIT_COUNT: number = 20;

export const apiGetPosts = (id: number) => {
    return apiGet('/profiles/' + id + '/posts/' + POSTS_LIMIT_COUNT, 200);
}

export const apiGetPostsBefore = (id: number, post_id: number) => {
    return apiGet('/profiles/' + id + '/posts/' + POSTS_LIMIT_COUNT + '/before/' + post_id, 200);
}