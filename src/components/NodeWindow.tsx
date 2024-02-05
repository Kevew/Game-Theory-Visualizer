import React from "react";
import '../css/NodeWindow.css';
import { connect } from "react-redux";
import { PlayerDict, State } from '../store/states';

interface CanvasProps {
    //ID of the node this window is attached to
    id: string,

    // Function call back to close window
    closeWindow: Function;

    /* Information from the store */
    // The saved strategies that it holds
    startingStratOne: string,
    startingStratTwo: string,
    // The saved players
    startingPlayerOne: string,
    startingPlayerTwo: string,
    // The saved dilemma it holds
    dilemma: number[][],
    dispatch: Function,

    // State information
    storePlayer: PlayerDict;
}

interface CanvasState {
    hidePlayer1: string,
    hidePlayer2: string,
}


class NodeWindow extends React.Component<CanvasProps, CanvasState>{
    constructor(props: CanvasProps){
        super(props);
        this.state = {
            hidePlayer1: 
                (props.startingPlayerOne != "Empty") ? props.startingPlayerOne : "",
            hidePlayer2:
                (props.startingPlayerTwo != "Empty") ? props.startingPlayerTwo : "",
        };
    }

    // Save changes for node
    saveChanges = (event: any) => {
        event.preventDefault();
        let player1 = event.target[0].value;
        let strat1 = event.target[1].value;
        let player2 = event.target[2].value;
        let strat2 = event.target[3].value;

        let input1 = JSON.parse("[" + event.target[4].value + "]");
        let input2 = JSON.parse("[" + event.target[5].value + "]");
        let input3 = JSON.parse("[" + event.target[6].value + "]");
        let input4 = JSON.parse("[" + event.target[7].value + "]");
        // Updates Player 1 if it changed
        if(player1 !== this.props.startingPlayerOne){
            this.props.dispatch({ type: 'CHANGE_PLAYER_1',
                                  player: player1,
                                  node_id: this.props.id});
        }

        // Updates Player 2 if it changed
        if(player2 !== this.props.startingPlayerTwo){
            this.props.dispatch({ type: 'CHANGE_PLAYER_2',
                                  player: player2,
                                  node_id: this.props.id});
        }
        // Change the strats based on new strat values
        this.props.dispatch({ type: 'CHANGE_STRAT',
                              strat1: strat1,
                              strat2: strat2,
                              node_id: this.props.id});
        // Change the strats based on the new dilemma
        this.props.dispatch({ type: 'UPDATEDILEMMA',
                              updatedVer: [input1, input2, input3, input4],
                              node_id: this.props.id});

        // Close the window
        this.props.closeWindow();
    }

    selectPlayer = (e: React.ChangeEvent<HTMLSelectElement>, selector: number) => {
        
        if(selector == 0){
            this.setState({
                hidePlayer1: (e.target.value != "Empty") ? e.target.value : ""
            });
        }else{
            this.setState({
                hidePlayer2: (e.target.value != "Empty") ? e.target.value : ""
            });
        }
    }
    
    render(){
        return(
            <div className="nodeWindowDiv">
                <form className="formSelector" onSubmit={(e) => this.saveChanges(e)}>
                    <select id={"player1Of" + this.props.id}
                            className="playerSelector"
                            defaultValue={this.props.startingPlayerOne}
                            data-test={"player1Of" + this.props.id}
                            onChange={(e) => this.selectPlayer(e, 0)}>
                            {
                                Object.keys(this.props.storePlayer).map((node, index) => 
                                (node != this.state.hidePlayer2) ? 
                                <option key={index} className="option" value={node}>{node}</option> : <></>)
                            }
                    </select>
                    <select id={"nodeStrategy1Selector" + this.props.id}
                            className="playerSelector"
                            defaultValue={this.props.startingStratOne}
                            data-test={"nodeStrategy1Selector" + this.props.id}>
                        <option className="option" value="Empty">Empty</option>
                        <option className="option" value="Always Cooperate">Always Cooperate</option>
                        <option className="option" value="Always Defect">Always Defect</option>
                    </select>
                    <select id={"player2Of" + this.props.id}
                            className="playerSelector"
                            defaultValue={this.props.startingPlayerTwo}
                            data-test={"player2Of" + this.props.id}
                            onChange={(e) => this.selectPlayer(e, 1)}>
                            {
                                Object.keys(this.props.storePlayer).map((node, index) => 
                                (node != this.state.hidePlayer1) ? 
                                <option key={index} className="option" value={node}>{node}</option>: <></>)
                            }
                    </select>
                    <select id={"nodeStrategy2Selector" + this.props.id}
                            className="playerSelector"
                            defaultValue={this.props.startingStratTwo}
                            data-test={"nodeStrategy2Selector" + this.props.id}>
                            <option className="option" value="Empty">Empty</option>
                            <option className="option" value="Always Cooperate">Always Cooperate</option>
                            <option className="option" value="Always Defect">Always Defect</option>
                    </select>
                    <input className="pointInputBar" defaultValue={this.props.dilemma[0].toString()}></input>
                    <input className="pointInputBar" defaultValue={this.props.dilemma[1].toString()}></input>
                    <input className="pointInputBar" defaultValue={this.props.dilemma[2].toString()}></input>
                    <input className="pointInputBar" defaultValue={this.props.dilemma[3].toString()}></input>
                    <button className="saveChanges" type='submit' data-test={"saveChanges" + this.props.id}>Save Changes</button>
                </form>
            </div>
        )
    }
}


// Get state information from store
const mapStateToProps = (state: State, prop: any) => ({
    startingPlayerOne: Object.hasOwn(state.nodeDict, prop.id) ? state.nodeDict[prop.id].playerOne : "",
    startingPlayerTwo: Object.hasOwn(state.nodeDict, prop.id) ? state.nodeDict[prop.id].playerTwo : "",
    startingStratOne: Object.hasOwn(state.nodeDict, prop.id) ? state.nodeDict[prop.id].strategyOne : "",
    startingStratTwo: Object.hasOwn(state.nodeDict, prop.id) ? state.nodeDict[prop.id].strategyTwo : "",
    dilemma: Object.hasOwn(state.nodeDict, prop.id) ? state.nodeDict[prop.id].dilemma : [[]],
    storePlayer: state.playerList
});
  
// Connect the component to the store
export default connect(mapStateToProps)(NodeWindow);