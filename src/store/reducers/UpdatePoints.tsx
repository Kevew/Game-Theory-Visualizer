import { initialState, State } from '../states';

type Action = {
    type: 'UPDATEPOINTS',
    player1: string,
    player2: string,
    incrementOneBy: number,
    incrementTwoBy: number
}

// Update the current scoreboard
export const updatePoints = (state: State = initialState, action: Action): State => {
    let pointDict = state.pointsPerPlayer;
    pointDict[action.player1] += action.incrementOneBy;
    pointDict[action.player2] += action.incrementTwoBy;
    return {...state, pointsPerPlayer: pointDict};
}