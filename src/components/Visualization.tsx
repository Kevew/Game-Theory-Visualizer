import React from 'react';
import '../css/VisualizeButton.css';
import { connect } from 'react-redux';
import { NodeState, State } from '../store/states';


interface CanvasProps {
    // NodeState from the store
    nodeState: NodeState[];
    // Allows communications/dispatchs to store
    dispatch: Function;
}

interface CanvasState {
    isVisualizing: boolean,
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class Visualize extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
        this.state = {
            isVisualizing: false,
        }
    }

    // When the Visualization Button has been clicked, begin the simulatio
    beginVisualization = async() => {
        // If it is already visualizing, stop visualizing
        if(this.state.isVisualizing){
            return;
        }
        this.setState({
            isVisualizing: true
        })
        this.props.dispatch({type: 'RESETPOINTS'});
        console.log("BEGIN VISUALIZATION");
        // Get all the starting nodes
        let length = this.props.nodeState.length;
        let queue = [];
        for(let i = 0;i < length;i++){
            if(this.props.nodeState[i].strategyOne != "Empty" && this.props.nodeState[i].strategyTwo != "Empty"){
                queue.push(this.props.nodeState[i]);
            }
        }

        let a = 0;
        let b = 0;
        
        //Pretend Strategy 1 is always cooperate
        //Pretend Strategy 2 is always defect


        //Go through all the starting nodes and determine who wins
        while(queue.length){
            let val = queue.pop();
            if(!val){
                continue;
            }
            this.props.dispatch({type: 'SIMULATIONNODESELECTOR', node_id: val.id});
            await delay(2000);
            if(val.strategyOne === "Strategy 1"){
                if(val.strategyTwo === "Strategy 1"){
                    a = val.dilemma[0][0];
                    b = val.dilemma[0][1];
                }else{
                    a = val.dilemma[1][0];
                    b = val.dilemma[1][1];
                }
            }else{
                if(val.strategyTwo === "Strategy 1"){
                    a = val.dilemma[2][0];
                    b = val.dilemma[2][1];
                }else{
                    a = val.dilemma[3][0];
                    b = val.dilemma[3][1];
                }
            }
            this.props.dispatch({type: 'UPDATEPOINTS', 
                                player1: val.playerOne,
                                player2: val.playerTwo,
                                incrementOneBy: a,
                                incrementTwoBy: b});
        }
        this.setState({
            isVisualizing: false
        })
        this.props.dispatch({type: 'SIMULATIONNODESELECTOR', node_id: -1});
    }
    render(){
        return(
            <>
                <button onClick={this.beginVisualization} className="visualizeButton">
                    <p>Visualize</p>
                </button>
            </>
        )
    }
}

const mapStateToProps = (state: State) => ({
    nodeState: state.nodeList
});

export default connect(mapStateToProps)(Visualize);
