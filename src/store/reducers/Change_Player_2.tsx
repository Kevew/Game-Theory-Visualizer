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

    let temporalPlayerList = {...state.playerList};
    let oldPlayerName = state.nodeList[Number(action.node_id)].playerTwo;
    temporalPlayerList[action.player].cnt += 1;
    temporalPlayerList[oldPlayerName].cnt -= 1;
    return {...state, nodeList: updatedNodeList2, playerList: temporalPlayerList};
}