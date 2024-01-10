import { initialState, State } from '../states';

type Action = {
    type: 'RESETPOINTS',
}

// Reset's the scoreboard to 0
export const reset_points = (state: State = initialState, action: Action): State => {
    let pointsTable = {...state.playerList};
    Object.keys(pointsTable).forEach(key => {
        pointsTable[key].points = 0;
    });
    
      
    return {...state, playerList: pointsTable};
}