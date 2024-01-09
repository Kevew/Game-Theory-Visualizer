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
    // First element is if both cooperates
    // Second is if strategy 1 cooperates but strategy 2 doesn't
    // Third is if strategy 2 cooperates but strategy 1 doesn't
    // Fourth is if both defect
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
    // Every Unique Strategy that exists, this is to keep track if there exists a node that holds the strategy
    strategyList: StrategyDict;
    // The points each strategy has during the simulation
    pointsPerStrat: StrategyDict;
}
  
// Define the initial state
export const initialState: State = {
    count: 0,
    nodeList: [],
    strategyList: {} as StrategyDict,
    pointsPerStrat: {} as StrategyDict
};