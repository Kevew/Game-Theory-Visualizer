import { initialState, State } from '../states';

type Action = {
    type: 'UPDATEPOINTS',
    strat1: string,
    strat2: string,
    incrementOneBy: number,
    incrementTwoBy: number
}

// Update the current scoreboard
export const updatePoints = (state: State = initialState, action: Action): State => {
    let pointDict = state.pointsPerStrat;
    pointDict[action.strat1] += action.incrementOneBy;
    pointDict[action.strat2] += action.incrementTwoBy;
    return {...state, pointsPerStrat: pointDict};
}