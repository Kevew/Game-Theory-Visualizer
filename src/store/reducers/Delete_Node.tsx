import { initialState, State } from '../states';

type Action = {
    type: 'DELETENODE',
    node_id: number,
  }

// Deletes one specific node
export const delete_node = (state: State = initialState, action: Action): State => {
    let a = state;
    delete a.nodeDict[action.node_id];
    a.count -= 1;
    return {...a};
}