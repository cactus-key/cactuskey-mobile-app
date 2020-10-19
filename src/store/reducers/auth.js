import bugsnag from '@bugsnag/expo';
const sha256 = require('sha256');
import {HK2} from '../../../config';

const initialState = { token: undefined, id: undefined };

function auth(state = initialState, action) {
    let nextState;
    const bugsnagClient = bugsnag();

    switch(action.type) {
        case 'STORE_USER_CREDS':
            nextState = {
                ...state,

                token: action.value.token,
                id: action.value.id,
                email: action.value.email,
                password_h2: sha256(`${HK2}${action.value.password_h1}`),
                server_delta: action.value.server_delta,
                salt: action.value.salt
            }

            bugsnagClient.user = {
                id: action.value.id
            }

            return nextState || state;

        case 'STORE_USER_TOKEN':
                nextState = {
                    ...state,
    
                    token: action.value.token,
                    id: action.value.id
                }

                bugsnagClient.user = {
                    id: action.value.id
                }
    
                return nextState || state;

        case 'CLEAR_USER_DATA':
            nextState = {
                ...state,
                token: undefined,
                id: undefined,
                email: undefined,
                password_h2: undefined,
                server_delta: undefined,
                salt: undefined
            }

            bugsnagClient.user = null

            return nextState || state;

        default:
            return state;
    }
}

export default auth;