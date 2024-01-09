import { initialState, State, NodeState } from '../states';

type Action ={
    type: 'CHANGE_STRATEGY_1',
    strategy: string,
    node_id: string
}

// Changes the strategy 1 of a specific node
export const change_strategy_1 = (state: State = initialState, action: Action): State => {
    let updatedNodeList1 = [...state.nodeList];
    updatedNodeList1[Number(action.node_id)] = {
        ...updatedNodeList1[Number(action.node_id)],
        strategyOne: action.strategy
    };

    let temporalStrategyDict = {...state.strategyList};
    let newStratName = action.strategy;
    let oldStratName = state.nodeList[Number(action.node_id)].strategyOne;

    let temporalPointsStrategy = {...state.pointsPerStrat}
    if(state.strategyList[newStratName] === undefined){
        temporalStrategyDict = {...temporalStrategyDict, 
                                [newStratName]: 1,
                                [oldStratName]: state.strategyList[oldStratName] - 1}
        temporalPointsStrategy = {...temporalPointsStrategy,
                                [newStratName]: 0}
    }else{
        temporalStrategyDict = {...temporalStrategyDict, 
                                [newStratName]: state.strategyList[newStratName] + 1,
                                [oldStratName]: state.strategyList[oldStratName] - 1}
    }
    if(temporalStrategyDict[oldStratName] == 0){
        delete temporalStrategyDict[oldStratName];
        delete temporalPointsStrategy[oldStratName];
    }
    return { ...state, nodeList: updatedNodeList1, strategyList: temporalStrategyDict, pointsPerStrat: temporalPointsStrategy};
}