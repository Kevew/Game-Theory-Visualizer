import { initialState, State, NodeState } from '../states';

type Action = {
    type: 'CHANGE_STRAT',
    strat1: string,
    strat2: string,
    node_id: string
}

// Changes the strategies of a specific node
export const change_strat = (state: State = initialState, action: Action): State => {
    return {...state, nodeList: [...state.nodeList.slice(0, Number(action.node_id)),
                                 {
                                    ...state.nodeList[Number(action.node_id)],
                                    strategyOne: action.strat1,
                                    strategyTwo: action.strat2,
                                 },
                                 ...state.nodeList.slice(Number(action.node_id) + 1)]}
}