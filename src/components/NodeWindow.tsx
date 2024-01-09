import React, { ReactEventHandler } from "react";
import '../css/NodeWindow.css';
import { connect } from "react-redux";
import { State } from '../store/states';

interface CanvasProps {
    //ID of the node this window is attached to
    id: string,
    /* Information from the store */
    // The saved strategies that it holds
    startingStratOne: string,
    startingStratTwo: string,
    // The saved dilemma it holds
    dilemma: number[][],
    dispatch: Function,
}

interface CanvasState {}


class NodeWindow extends React.Component<CanvasProps, CanvasState>{
    constructor(props: CanvasProps){
        super(props);
    }

    // Changing strategy 1 dropdown updates store
    handleStrategyChange1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let {value} = e.target;
        this.props.dispatch({ type: 'CHANGE_STRATEGY_1',
                              strategy: value,
                              node_id: this.props.id});
    }

    // Changing strategy 2 dropdown updates store
    handleStrategyChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let {value} = e.target;
        this.props.dispatch({ type: 'CHANGE_STRATEGY_2',
                              strategy: value,
                              node_id: this.props.id});
    }
    

    render(){
        return(
            <div className="nodeWindowDiv">
                <select     onChange={this.handleStrategyChange1}
                            id={"nodeStrategy1Selector" + this.props.id}
                            value={this.props.startingStratOne}>
                    <option value="Empty">Empty</option>
                    <option value="Strategy 1">Strategy 1</option>
                    <option value="Strategy 2">Strategy 2</option>
                </select>
                <select     onChange={this.handleStrategyChange2}
                            id={"nodeStrategy2Selector" + this.props.id}
                            value={this.props.startingStratTwo}>
                    <option value="Empty">Empty</option>
                    <option value="Strategy 1">Strategy 1</option>
                    <option value="Strategy 2">Strategy 2</option>
                </select>
                <input className="pointInputBar" defaultValue={this.props.dilemma[0].toString()}></input>
                <input className="pointInputBar" defaultValue={this.props.dilemma[1].toString()}></input>
                <input className="pointInputBar" defaultValue={this.props.dilemma[2].toString()}></input>
                <input className="pointInputBar" defaultValue={this.props.dilemma[3].toString()}></input>
            </div>
        )
    }
}


// Get state information from store
const mapStateToProps = (state: State, prop: any) => ({
    startingStratOne: state.nodeList[prop.id].strategyOne,
    startingStratTwo: state.nodeList[prop.id].strategyTwo,
    dilemma: state.nodeList[prop.id].dilemma
});
  
// Connect the component to the store
export default connect(mapStateToProps)(NodeWindow);