const initialState = {
    auth_modal_callback: null
};

function modals(state = initialState, action) {
    let nextState;

    switch(action.type) {
        case 'REGISTER_AUTH_MODAL_CALLBACK':
            nextState = {
                ...state,
                auth_modal_callback: action.callback
            }
            return nextState || state;

        case 'OPEN_AUTH_MODAL':
            if (state.auth_modal_callback) {
                state.auth_modal_callback();
            }
            return state;

        default:
            return state;
    }
}

export default modals;