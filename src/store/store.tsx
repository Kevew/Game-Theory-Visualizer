import { createStore } from 'redux';
import { initialState, State, Color } from './states';
import { increment } from './reducers/Increment';
import { change_player_1 } from './reducers/Change_Player_1';
import { change_player_2 } from './reducers/Change_Player_2';
import { updatePoints } from './reducers/UpdatePoints';
import { change_strat } from './reducers/Change_Strat';
import { update_dilemma } from './reducers/Update_Dilemma';
import { reset_points } from './reducers/Reset_Points';
import { add_player } from './reducers/Add_Player';
import { mode_selector } from './reducers/Mode_Selector';
import { set_current_sim_node } from './reducers/Set_Current_Sim_Node';

// Define the action types
type Action =
  {
    type: 'INCREMENT'
    node_id: string
  } |{
    type: 'DECREMENT'
  }|{
    type: 'CHANGE_PLAYER_1',
    player: string,
    node_id: string
  }|{
    type: 'CHANGE_PLAYER_2',
    player: string,
    node_id: string
  }|{
    type: 'UPDATEPOINTS',
    player1: string,
    player2: string,
    incrementOneBy: number,
    incrementTwoBy: number
  }|{
    type: 'CHANGE_STRAT',
    strat1: string,
    strat2: string,
    node_id: string
  }|{
    type: 'UPDATEDILEMMA',
    updatedVer: number[][],
    node_id: string
  }|
  {
  type: 'RESETPOINTS'
  }|{
  type: 'ADDPLAYER',
  name: string,
  color: Color
  }|{
  type: 'MODESELECTOR',
  mode: number
}|{
  type: 'SIMULATIONNODESELECTOR',
  node_id: number
};

// Define the reducer
const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return increment(state, action);
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'CHANGE_PLAYER_1':
      return change_player_1(state, action);
    case 'CHANGE_PLAYER_2':
      return change_player_2(state, action);
    case 'UPDATEPOINTS':
      return updatePoints(state, action);
    case 'CHANGE_STRAT':
      return change_strat(state, action);
    case 'UPDATEDILEMMA':
      return update_dilemma(state, action);
    case 'RESETPOINTS':
      return reset_points(state, action);
    case 'ADDPLAYER':
      return add_player(state, action);
    case 'MODESELECTOR':
      return mode_selector(state, action);
    case 'SIMULATIONNODESELECTOR':
      return set_current_sim_node(state, action);
    default:
      return state;
  }
};

// Create the store
export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;