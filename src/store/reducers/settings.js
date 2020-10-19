import { OnboardingStep } from "../../models/OnboardingStep";

const initialState = {
    onboarding_step: OnboardingStep.NOT_STARTED
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

        default:
            return state;
    }
}

export default settings;