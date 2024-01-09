import { initialState, State, NodeState } from '../states';

type Action ={
    type: 'CHANGE_STRATEGY_2',
    strategy: string,
    node_id: string
}

export const change_strategy_2 = (state: State = initialState, action: Action): State => {
    let updatedNodeList2 = [...state.nodeList];
    updatedNodeList2[Number(action.node_id)] = {
        ...updatedNodeList2[Number(action.node_id)],
        strategyTwo: action.strategy
    };

    let temporalStrategyDict = {...state.strategyList};
    let newStratName = action.strategy;
    let oldStratName = state.nodeList[Number(action.node_id)].strategyTwo;
    if(state.strategyList[newStratName] === undefined){
        temporalStrategyDict = {...temporalStrategyDict, 
                                [newStratName]: 1,
                                [oldStratName]: state.strategyList[oldStratName] - 1}
    }else{
        temporalStrategyDict = {...temporalStrategyDict, 
                                [newStratName]: state.strategyList[newStratName] + 1,
                                [oldStratName]: state.strategyList[oldStratName] - 1}
    }
    if(temporalStrategyDict[oldStratName] == 0){
        delete temporalStrategyDict[oldStratName];
    }
    return { ...state, nodeList: updatedNodeList2, strategyList: temporalStrategyDict };
}