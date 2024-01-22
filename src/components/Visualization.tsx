import React from 'react';
import { connect } from 'react-redux';
import { NodeDict, State, NodeState } from '../store/states';

interface CanvasProps {
    // NodeState from the store
    nodeState: NodeDict;
    // Allows communications/dispatchs to store
    dispatch: Function;
}

interface CanvasState {
    isVisualizing: boolean,
    notificationAnimationPos: number[],
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class Visualize extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
        this.state = {
            isVisualizing: false,
            notificationAnimationPos: [],
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
        let queue: NodeState[] = [];
        Object.values(this.props.nodeState).forEach(function(value) {
            // Make sure the node is a starting node
            if(value.strategyOne != "Empty" && 
                value.strategyTwo != "Empty" &&
                value.playerOne != "Empty" &&
                value.playerTwo != "Empty"){
                queue.push(value);
            }
        });          

        let a = 0;
        let b = 0;

        //Go through all the starting nodes and determine who wins
        while(queue.length){
            let val = queue.pop();
            if(!val){
                continue;
            }
            if(val.strategyOne === "Always Cooperate"){
                if(val.strategyTwo === "Always Cooperate"){
                    a = val.dilemma[0][0];
                    b = val.dilemma[0][1];
                }else{
                    a = val.dilemma[1][0];
                    b = val.dilemma[1][1];
                }
            }else{
                if(val.strategyTwo === "Always Cooperate"){
                    a = val.dilemma[2][0];
                    b = val.dilemma[2][1];
                }else{
                    a = val.dilemma[3][0];
                    b = val.dilemma[3][1];
                }
            }
            
            // Perform Score Animation
            let pos = document.getElementById(val.id.toString())?.getBoundingClientRect();
            this.props.dispatch({type: 'SIMULATIONNODESELECTOR', node_id: val.id});
            if(pos != undefined){
                this.setState({
                    notificationAnimationPos: [Number(pos.left) + 25,
                                                Number(pos.top) + 25,
                                                a,
                                                b]
                })
            }
            this.props.dispatch({type: 'UPDATEPOINTS', 
                                player1: val.playerOne,
                                player2: val.playerTwo,
                                incrementOneBy: a,
                                incrementTwoBy: b});
            await delay(2000);
            this.setState({
                notificationAnimationPos: []
            })
            await delay(50);
        }
        this.setState({
            isVisualizing: false
        })
        this.props.dispatch({type: 'SIMULATIONNODESELECTOR', node_id: -1});
        console.log("END VISUALIZATION");
    }
    render(){

        let aDiv;
        let bDiv;
        if(this.state.notificationAnimationPos.length === 4){
            aDiv = <div style={{left: this.state.notificationAnimationPos[0],
                            top: this.state.notificationAnimationPos[1]}}
                     className='pointPopupA'>{(this.state.notificationAnimationPos[2] < 0) ? "":"+"}{this.state.notificationAnimationPos[2]}</div>
            bDiv = <div style={{left: this.state.notificationAnimationPos[0],
                        top: this.state.notificationAnimationPos[1]}}
                        className='pointPopupB'>{(this.state.notificationAnimationPos[3] < 0) ? "":"+"}{this.state.notificationAnimationPos[3]}</div>
        }
        return(
            <>
                <button data-test="visualizeButton" onClick={this.beginVisualization} className="visualizeButton">
                    Visualize
                    {aDiv}
                    {bDiv}
                </button>
            </>
        )
    }
}

const mapStateToProps = (state: State) => ({
    nodeState: state.nodeDict
});

export default connect(mapStateToProps)(Visualize);
