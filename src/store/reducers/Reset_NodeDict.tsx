import { initialState, State } from '../states';
import { NodeDict } from '../states';

type Action = {
    type: 'RESETNODEDICT',
    new_node_dict: string[]
};

// Modifies the current user mode
export const reset_node_dict = (state: State = initialState, action: Action): State => {
    let newNodeDict = state.nodeDict;
    let length = Object.keys(newNodeDict).length;
    for(let i = 0;i < length;i++){
        newNodeDict[action.new_node_dict[i]] = {
            ...newNodeDict[action.new_node_dict[i]],
            playerOne: "Empty",
            playerTwo: "Empty",
            strategyOne: "Empty",
            strategyTwo: "Empty"
        }
    }
    return {...state, nodeDict: newNodeDict};
}