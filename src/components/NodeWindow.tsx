import React, { ReactEventHandler } from "react";
import '../css/NodeWindow.css';
import { connect } from "react-redux";
import { State } from '../store/states';

interface CanvasProps {
    id: string;
    startingStratOne: string;
    startingStratTwo: string;
    dispatch: Function;
}

interface CanvasState {
    currentStrategy1: string,
    currentStrategy2: string
}


class NodeWindow extends React.Component<CanvasProps, CanvasState>{
    constructor(props: CanvasProps){
        super(props);
        this.state = {
            currentStrategy1: "-1",
            currentStrategy2: "-1"
        }
    }

    handleStrategyChange1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let {value} = e.target;
        this.props.dispatch({ type: 'CHANGE_STRATEGY_1',
                              strategy: value,
                              node_id: this.props.id});
    }

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
            </div>
        )
    }
}



const mapStateToProps = (state: State, prop: any) => ({
    startingStratOne: state.nodeList[prop.id].strategyOne,
    startingStratTwo: state.nodeList[prop.id].strategyTwo,
});
  
// Connect the component to the store
export default connect(mapStateToProps)(NodeWindow);