import { apiGet } from './api.service';

export const publicService = {
    interests: () => {
        return apiGet('/interests', 200);
    }
};
