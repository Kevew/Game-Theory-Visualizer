import { initialState, NodeDict, State } from '../states';

type Action = {
    type: 'UPDATEDILEMMA',
    updatedVer: number[][],
    node_id: string
}

// Update the dilemma of a node
export const update_dilemma = (state: State = initialState, action: Action): State => {
    return {...state, nodeDict: {...state.nodeDict, [action.node_id]: {
                                                    ...state.nodeDict[action.node_id], 
                                                    dilemma: action.updatedVer}}};
}