import { initialState, State, NodeState } from '../states';

type Action ={
    type: 'CHANGE_PLAYER_1',
    player: string,
    node_id: string
}

// Changes the player 1 of a specific node
export const change_player_1 = (state: State = initialState, action: Action): State => {
    let updatedNodeList1 = [...state.nodeList];
    updatedNodeList1[Number(action.node_id)] = {
        ...updatedNodeList1[Number(action.node_id)],
        playerOne: action.player
    };

    let temporalPlayerList = {...state.playerList};
    let oldPlayerName = state.nodeList[Number(action.node_id)].playerOne;
    temporalPlayerList[action.player].cnt += 1;
    temporalPlayerList[oldPlayerName].cnt -= 1;
    return {...state, nodeList: updatedNodeList1, playerList: temporalPlayerList};
}