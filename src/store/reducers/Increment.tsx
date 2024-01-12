import { initialState, State, NodeState } from '../states';

type Action = {
    type: 'INCREMENT'
    node_id: string
} 

// Adds a new node to the store
export const increment = (state: State = initialState, action: Action): State => {
    let newNode: NodeState = {
        id: Number(action.node_id),
        connect_to: [],
        playerOne: Object.keys(state.playerList)[0],
        playerTwo: Object.keys(state.playerList)[1],
        strategyOne: 'Empty',
        strategyTwo: 'Empty',
        dilemma: [[2, 2], [0, 4], [4, 0], [1, 1]]
      };
    let newPlayerList = {...state.playerList};
    newPlayerList[Object.keys(state.playerList)[0]].cnt += 1;
    newPlayerList[Object.keys(state.playerList)[1]].cnt += 1;
    return { ...state, count: state.count + 1,
              nodeDict: {...state.nodeDict, [action.node_id]: newNode},
              playerList: newPlayerList}
}