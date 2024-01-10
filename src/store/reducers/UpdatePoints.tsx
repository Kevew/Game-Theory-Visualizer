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
    let pointDict = state.playerList;
    pointDict[action.player1].points += action.incrementOneBy;
    pointDict[action.player2].points += action.incrementTwoBy;
    return {...state, playerList: pointDict};
}