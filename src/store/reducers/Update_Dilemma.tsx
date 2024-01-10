import { initialState, State } from '../states';

type Action = {
    type: 'UPDATEDILEMMA',
    updatedVer: number[][],
    node_id: string
}

// Update the dilemma of a node
export const update_dilemma = (state: State = initialState, action: Action): State => {
    return {...state, nodeList: [...state.nodeList.slice(0, Number(action.node_id)),
                                {
                                    ...state.nodeList[Number(action.node_id)],
                                    dilemma: action.updatedVer,
                                },
                                ...state.nodeList.slice(Number(action.node_id) + 1)]};
}