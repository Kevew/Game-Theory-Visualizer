import { initialState, State } from '../states';

type Action = {
    type: 'ADDCONNECTION',
    id: string,
    to_connect: string
  }

export const add_connection = (state: State = initialState, action: Action): State => {
    let newDict = state.nodeDict;
    newDict[action.id].connect_to.push(action.to_connect);
    newDict[action.to_connect].connect_from.push(action.id);
    return {...state, nodeDict: newDict};
}