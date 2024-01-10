import { initialState, State } from '../states';
import { Color } from '../states';

type Action = {
    type: 'ADDPLAYER',
    name: string,
    color: Color
  }

// Changes the player 1 of a specific node
export const add_player = (state: State = initialState, action: Action): State => {
    let actionList = state.playerList;
    actionList[action.name] = {cnt: 0, points: 0, colorAsso: action.color};
    return {...state};
}