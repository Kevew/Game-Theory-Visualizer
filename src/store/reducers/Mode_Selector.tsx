import { initialState, State } from '../states';

type Action = {
    type: 'MODESELECTOR',
    mode: number
};

// Modifies the current user mode
export const mode_selector = (state: State = initialState, action: Action): State => {
    return {...state, mode: action.mode};
}