import { initialState, State, NodeState } from '../states';

type Action ={
    type: 'CHANGE_PLAYER_2',
    player: string,
    node_id: string
}

// Changes the player 2 of a specific node
export const change_player_2 = (state: State = initialState, action: Action): State => {
    let updatedNodeList2 = [...state.nodeList];
    updatedNodeList2[Number(action.node_id)] = {
        ...updatedNodeList2[Number(action.node_id)],
        playerTwo: action.player
    };

    let temporalPlayerDict = {...state.playerList};
    let newPlayerName = action.player;
    let oldPlayerName = state.nodeList[Number(action.node_id)].playerTwo;

    let temporalPointsPlayer = {...state.playerList}
    if(state.playerList[newPlayerName] === undefined){
        temporalPlayerDict = {...temporalPlayerDict, 
                                [newPlayerName]: 1,
                                [oldPlayerName]: state.playerList[oldPlayerName] - 1}
        temporalPointsPlayer = {...temporalPointsPlayer,
                                [newPlayerName]: 0}
    }else{
        temporalPlayerDict = {...temporalPlayerDict, 
                                [newPlayerName]: state.playerList[newPlayerName] + 1,
                                [oldPlayerName]: state.playerList[oldPlayerName] - 1}
    }
    if(temporalPlayerDict[oldPlayerName] == 0){
        delete temporalPlayerDict[oldPlayerName];
        delete temporalPointsPlayer[oldPlayerName];
    }
    return {...state, nodeList: updatedNodeList2, playerList: temporalPlayerDict, pointsPerPlayer: temporalPointsPlayer};
}