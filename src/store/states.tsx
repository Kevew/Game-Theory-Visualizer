// The information each node holds 
export interface NodeState{
    // The id of the node
    id: number;
    // Which nodes the current node is connected to
    connect_to: number[];
    // The first strategy of the node
    strategyOne: string;
    // The second strategy of the node
    strategyTwo: string;
    // The prisoner's dilema of this specfic node
    dilemma: number[][];
}
export interface StrategyDict {
    [key: string]: number;
}
  
// Define the state type
export interface State {
    // The number of nodes currently in canvas
    count: number;
    // The nodes stored
    nodeList: NodeState[];
    // Every Unique Strategy that exists
    strategyList: StrategyDict;
}
  
// Define the initial state
export const initialState: State = {
    count: 0,
    nodeList: [],
    strategyList: {} as StrategyDict
};