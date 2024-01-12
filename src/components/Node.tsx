import React from "react";
import '../css/Node.css'
import NodeWindow from "./NodeWindow";

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
        if(target.className == "nodeDiv " && this.props.mode == 1 && this.props.changedSince <= 0){
            this.setState((prevState) => ({
                enableWindow: prevState.enableWindow ? false : true
            }));
        }
    }

    render(){
        if(!this.state.enableWindow){
            return <div id={this.props.id} onMouseUp={(e) => this.openWindow(e)} className={`nodeDiv ${(this.props.curr_node === Number(this.props.id)) ? 'selected' : ''}`} style={{left: this.props.posX, top: this.props.posY}}/>
        }else{
            return(
                <div id={this.props.id} onMouseUp={(e) => this.openWindow(e)} className={`nodeDiv ${(this.props.curr_node === Number(this.props.id)) ? 'selected' : ''}`} style={{left: this.props.posX, top: this.props.posY}}>
                    <NodeWindow id={this.props.id}/>
                </div>
            )
        }
    }
}

export default Node;