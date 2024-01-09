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
        strategyOne: 'Empty',
        strategyTwo: 'Empty',
        dilemma: [[2, 2], [0, 4], [4, 0], [1, 1]]
      };
      if(state.strategyList['Empty'] === undefined){
        return { ...state, count: state.count + 1,
                nodeList: [...state.nodeList, newNode],
                strategyList: {...state.strategyList, 'Empty': 2}};
      }else{
        return { ...state, count: state.count + 1,
                nodeList: [...state.nodeList, newNode],
                strategyList: {...state.strategyList, 'Empty': state.strategyList['Empty'] + 2}}
      };
}