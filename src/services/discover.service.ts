import { apiPost } from './api.service';

export const apiSearch = (search: string) => {
    return apiPost('/discover/search', {s: search}, 200);
}