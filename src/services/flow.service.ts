import { apiGet } from './api.service';
import Store from '../store/configure_store';

const LIMIT_COUNT: number = 20;

function interestsToQueryParams() {
    const state = Store.getState();
    return `?i=${state.preferences.interests.join("%2C")}`;
}

export default {
    list: () => {
        return apiGet('/flow/' + LIMIT_COUNT + interestsToQueryParams(), 200);
    },

    listBefore: (post_id: number) => {
        return apiGet('/flow/' + LIMIT_COUNT + '/before/' + post_id + interestsToQueryParams(), 200);
    },

    listAfter: (post_id: number) => {
        return apiGet('/flow/' + LIMIT_COUNT + '/after/' + post_id + interestsToQueryParams(), 200);
    }
}
