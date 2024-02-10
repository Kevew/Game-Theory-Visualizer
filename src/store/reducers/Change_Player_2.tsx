import { initialState, State } from '../states';

type Action = {
    type: 'CHANGE_PLAYER_2',
    player: string,
    node_id: string
}

// Changes the player 2 of a specific node
export const change_player_2 = (state: State = initialState, action: Action): State => {
    let updatedNodeList2 = {...state.nodeDict};
    updatedNodeList2[action.node_id] = {
        ...updatedNodeList2[action.node_id],
        playerTwo: action.player
    };

    let temporalPlayerList = {...state.playerList};
    let oldPlayerName = state.nodeDict[action.node_id].playerTwo;
    temporalPlayerList[action.player].cnt += 1;
    temporalPlayerList[oldPlayerName].cnt -= 1;
    return {...state, nodeDict: updatedNodeList2, playerList: temporalPlayerList};
}