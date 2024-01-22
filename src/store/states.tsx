type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX | string;

// The information each node holds 
export interface NodeState{
    // The id of the node
    id: number;
    // Which nodes the current node is connected to
    connect_to: number[];
    // Player 1 of the node
    playerOne: string;
    // Player 2 of the node
    playerTwo: string;
    // The strategy player 1 uses
    strategyOne: string;
    // The strategy player 2 uses
    strategyTwo: string;
    // The prisoner's dilema of this specfic node
    // First element is if both cooperates
    // Second is if strategy 1 cooperates but strategy 2 doesn't
    // Third is if strategy 2 cooperates but strategy 1 doesn't
    // Fourth is if both defect
    dilemma: number[][];
}




export interface NodeDict {
    [key: string]: NodeState;
}

export interface PlayerDict {
    [key: string]: {
        cnt: number,
        points: number,
        colorAsso: Color
    };
}
  
// Define the state type
export interface State {
    // The number of nodes currently in canvas
    count: number;
    // The nodes stored
    nodeDict: NodeDict;
    // Information each player holds
    playerList: PlayerDict;
    // The mode the user is in, 1 - Add/Edit Node, 2 - Delete Node, 3 - Connect Node
    mode: number;
    

    /* Simulation info */
    // Where the simulation currently is at
    currentNode: number;
}
  
// Define the initial state
export const initialState: State = {
    count: 0,
    nodeDict: {} as NodeDict,
    playerList: {'Empty': {cnt: 0, points: 0, colorAsso: '#c4c4c4'},
                 'Player 1': {cnt: 1, points: 0, colorAsso: '#FF0000'},
                 'Player 2': {cnt: 1, points: 0, colorAsso: '#0000FF'}} as PlayerDict,
    mode: 1,
    currentNode: -1,
};