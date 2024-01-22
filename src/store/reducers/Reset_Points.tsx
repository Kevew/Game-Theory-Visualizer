import { initialState, State } from '../states';

// Reset's the scoreboard to 0
export const reset_points = (state: State = initialState): State => {
    let pointsTable = {...state.playerList};
    Object.keys(pointsTable).forEach(key => {
        pointsTable[key].points = 0;
    });
    
      
    return {...state, playerList: pointsTable};
}