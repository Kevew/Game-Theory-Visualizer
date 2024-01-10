import { initialState, State } from '../states';

type Action = {
    type: 'SIMULATIONNODESELECTOR',
    node_id: number
};

// Set which node the simulation current is at
export const set_current_sim_node = (state: State = initialState, action: Action): State => {
    return {...state, currentNode: action.node_id};
}