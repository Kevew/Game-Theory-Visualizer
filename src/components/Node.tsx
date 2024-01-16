import React from "react";
import '../css/Node.css'
import NodeWindow from "./NodeWindow";
import { NodeColor } from "./NodeColor";
import { State } from "../store/states";
import { connect } from "react-redux";

interface CanvasProps {
    // Current position given from Canvas Component
    posX: number;
    posY: number;
    // The ID of this node
    id: string;
    // Node Management Setting
    mode: number;
    // Current node the simulation is at
    curr_node: number;

    // Value to check if mouse has been moved
    changedSince: number;

    // Player Colours
    topPlayerColour: string;
    bottemPlayerColour: string;
}

interface CanvasState {
    // Boolean to determine whether to show it's nodeWindow or not
    enableWindow: boolean;
}

class Node extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
        this.state = {
            enableWindow: false
        }
    }

    openWindow = (event: React.MouseEvent) => {
        let target = event.target as Element;
        // If mouse is clicking node, then open or close window
        // Also checks if user is currently in edit mode
        console.log(this.props.changedSince)
        if((target.className == "bottemHalfCircle" || target.className == "topHalfCircle") && 
                                                        this.props.mode == 1 && 
                                                        this.props.changedSince <= 0.02){
            this.setState((prevState) => ({
                enableWindow: prevState.enableWindow ? false : true
            }));
        }
    }

    render(){
        if(!this.state.enableWindow){
            return(
                <div data-test="node" id={this.props.id} onMouseUp={(e) => this.openWindow(e)} className={`nodeDiv ${(this.props.curr_node === Number(this.props.id)) ? 'selected' : ''}`} style={{left: this.props.posX, top: this.props.posY}}>
                    <NodeColor pos={true} color={this.props.topPlayerColour}/>
                    <NodeColor pos={false} color={this.props.bottemPlayerColour}/>
                </div>
            )
        }else{
            return(
                <div data-test="node" id={this.props.id} onMouseUp={(e) => this.openWindow(e)} className={`nodeDiv ${(this.props.curr_node === Number(this.props.id)) ? 'selected' : ''}`} style={{left: this.props.posX, top: this.props.posY}}>
                    <NodeColor pos={true} color={this.props.topPlayerColour}/>
                    <NodeWindow id={this.props.id}/>
                    <NodeColor pos={false} color={this.props.bottemPlayerColour}/>
                </div>
            )
        }
    }
}

// Get the information from the store
const mapStateToProps = (state: State, props: CanvasProps) => ({
    topPlayerColour: Object.hasOwn(state.nodeDict, props.id) ? state.playerList[state.nodeDict[props.id].playerOne].colorAsso : "",
    bottemPlayerColour: Object.hasOwn(state.nodeDict, props.id) ? state.playerList[state.nodeDict[props.id].playerTwo].colorAsso : "",
});
  
// Connect the component to the store
export default connect(mapStateToProps)(Node);