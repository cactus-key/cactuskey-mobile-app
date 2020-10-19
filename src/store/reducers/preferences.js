const initialState = {
    interests: null,
    device_data: null
};

function preferences(state = initialState, action) {
    let nextState;

    switch(action.type) {
        case 'STORE_INTERESTS':
            nextState = {
                ...state,
                interests: action.value
            }
            return nextState || state;

        case 'STORE_DEVICE_DATA':
            nextState = {
                ...state,
                device_data: action.value
            }
            return nextState || state;

        default:
            return state;
    }
}

export default preferences;