import React from 'react';
import { connect } from 'react-redux';
import { NodeDict, State, NodeState, PlayerDict } from '../store/states';

interface CanvasProps {
    // NodeState from the store
    nodeState: NodeDict;
    // playerList from store
    playerList: PlayerDict
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


    // Perform the score animation
    performScoreAnimation = (a: number, b: number, val: NodeState) => {
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
    }

    // When the Visualization Button has been clicked, begin the simulatio
    beginVisualization = async() => {
        // If it is already visualizing, stop visualizing
        // During the visualization, a record of the deleted connectTo nodes will be noted
        // and updated at the end of the visualization
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

        let resetChangesId: string[] = [];
        let hasGone = new Set();

        //Go through all the starting nodes and determine who wins
        while(queue.length){
            let val = queue.pop();
            if(!val){
                continue;
            }
            // Get strategy results
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
            this.performScoreAnimation(a, b, val);
            hasGone.add(val.id);
            await delay(2000);
            // Perform updates to the map
            val.connect_to.forEach((item) => {
                // Check if there is two nodes or one node
                if(this.props.nodeState[item].connect_from.length == 2){
                    // Check if first player has been filled
                    if(val){
                        let winnerPlayer = "";
                        let winnerStrategy = "";
                        if(this.props.playerList[val.playerOne].points >= 
                            this.props.playerList[val.playerTwo].points){
                            winnerPlayer = val.playerOne;
                            winnerStrategy = val.strategyOne;
                        }else{
                            winnerPlayer = val.playerTwo;
                            winnerStrategy = val.strategyTwo;
                        }
                        if(this.props.nodeState[item].playerOne != "Empty"){
                            this.props.nodeState[item].playerTwo = winnerPlayer;
                            this.props.nodeState[item].strategyTwo = winnerStrategy;
                            this.props.dispatch({ type: 'CHANGE_PLAYER_2',
                                                player: winnerPlayer,
                                                node_id: item});
                        }else{
                            this.props.nodeState[item].playerOne = winnerPlayer;
                            this.props.nodeState[item].strategyOne = winnerStrategy;
                            this.props.dispatch({ type: 'CHANGE_PLAYER_1',
                                                player: winnerPlayer,
                                                node_id: item});
                        }
                        this.props.dispatch({ type: 'CHANGE_STRAT',
                                            strat1: this.props.nodeState[item].strategyOne,
                                            strat2: this.props.nodeState[item].strategyTwo,
                                            node_id: item});
                        }
                        if(this.props.nodeState[item].playerTwo != "Empty"){
                            queue.push(this.props.nodeState[item]);
                        }else{
                            resetChangesId.push(item);
                        }
                }else{
                    if(val && !hasGone.has(item)){
                        this.props.nodeState[item].playerOne = val.playerOne;
                        this.props.nodeState[item].playerTwo = val.playerTwo;
                        this.props.nodeState[item].strategyOne = val.strategyOne;
                        this.props.nodeState[item].strategyTwo = val.strategyTwo;
                        this.props.dispatch({ type: 'CHANGE_PLAYER_1',
                                            player: val.playerOne,
                                            node_id: item});
                        this.props.dispatch({ type: 'CHANGE_PLAYER_2',
                                            player: val.playerTwo,
                                            node_id: item});
                        this.props.dispatch({ type: 'CHANGE_STRAT',
                                            strat1: val.strategyOne,
                                            strat2: val.strategyTwo,
                                            node_id: item});
                        resetChangesId.push(item);
                        queue.push(this.props.nodeState[item]);
                    }
                }
            })
            this.setState({
                notificationAnimationPos: []
            })
            await delay(50);
        }
        this.setState({
            isVisualizing: false
        })
        this.props.dispatch({type: "RESETNODEDICT",
                            new_node_dict: resetChangesId})
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
    nodeState: state.nodeDict,
    playerList: state.playerList
});

export default connect(mapStateToProps)(Visualize);
