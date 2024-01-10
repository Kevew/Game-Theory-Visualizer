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
        playerOne: "Player 1",
        playerTwo: "Player 2",
        strategyOne: 'Empty',
        strategyTwo: 'Empty',
        dilemma: [[2, 2], [0, 4], [4, 0], [1, 1]]
      };
    if(state.playerList['Player 1'] === undefined){
      return { ...state, count: state.count + 1,
               nodeList: [...state.nodeList, newNode],
               playerList: {...state.playerList, 'Player 1': 1, 'Player 2': 1},
               pointsPerPlayer: {...state.pointsPerPlayer, 'Player 1': 0, 'Player 2': 0}};
    }else{
      return { ...state, count: state.count + 1,
               nodeList: [...state.nodeList, newNode],
               playerList: {...state.playerList, 'Player 1': state.playerList['Player 1'] + 1, 
                                                 'Player 2': state.playerList['Player 2'] + 1}}
    };
}