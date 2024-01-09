import { createStore } from 'redux';
import { initialState, State, NodeState } from './states';
import { increment } from './reducers/Increment';
import { change_strategy_1 } from './reducers/Change_Strat_1';
import { change_strategy_2 } from './reducers/Change_Strat_2';
import { updatePoints } from './reducers/UpdatePoints';

// Define the action types
type Action =
  {
    type: 'INCREMENT'
    node_id: string
  } 
  |{
    type: 'DECREMENT'
  }
  |{
    type: 'CHANGE_STRATEGY_1',
    strategy: string,
    node_id: string
  }
  |{
    type: 'CHANGE_STRATEGY_2',
    strategy: string,
    node_id: string
  }
  |{
    type: 'UPDATEPOINTS',
    strat1: string,
    strat2: string,
    incrementOneBy: number,
    incrementTwoBy: number
};

// Define the reducer
const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return increment(state, action);
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'CHANGE_STRATEGY_1':
      return change_strategy_1(state, action);
    case 'CHANGE_STRATEGY_2':
      return change_strategy_2(state, action);
    case 'UPDATEPOINTS':
      return updatePoints(state, action);
    default:
      return state;
  }
};

// Create the store
export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;