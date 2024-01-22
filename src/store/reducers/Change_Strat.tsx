import { initialState, State } from '../states';

type Action = {
    type: 'CHANGE_STRAT',
    strat1: string,
    strat2: string,
    node_id: string
}

// Changes the strategies of a specific node
export const change_strat = (state: State = initialState, action: Action): State => {
    return {...state, nodeDict: {...state.nodeDict, [action.node_id]:
                                 {
                                    ...state.nodeDict[action.node_id],
                                    strategyOne: action.strat1,
                                    strategyTwo: action.strat2,
                                 },
                                }
    }
}