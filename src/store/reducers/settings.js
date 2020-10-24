import { OnboardingStep } from "../../models/OnboardingStep";

const initialState = {
    onboarding_step: OnboardingStep.NOT_STARTED,
    current_theme: 'light'
};

function settings(state = initialState, action) {
    let nextState;

    switch(action.type) {
        case 'ONBOARDING_GET_STARTED':
            if (state.onboarding_step === OnboardingStep.NOT_STARTED) {
                nextState = {
                    ...state,
                    onboarding_step: OnboardingStep.DONE
                }
            }
            return nextState || state;

        case 'SET_CURRENT_THEME':
            // Vallidate from available themes
            if (action.value !== 'light' && action.value !== 'dark')
                action.value = 'light';

            return {
                ...state,
                current_theme: action.value
            };

        default:
            return state;
    }
}

export default settings;