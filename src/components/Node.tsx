import React from "react";
import '../css/Node.css'
import NodeWindow from "./NodeWindow";

interface CanvasProps {
    posX: number;
    posY: number;
    id: string;
}

interface CanvasState {
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
        if(target.className == "nodeDiv"){
            this.setState((prevState) => ({
                enableWindow: prevState.enableWindow ? false : true
            }));
        }
    }

    render(){
        if(!this.state.enableWindow){
            return <div id={this.props.id} onMouseDown={(e) => this.openWindow(e)} className="nodeDiv" style={{left: this.props.posX, top: this.props.posY}}/>
        }else{
            return(
                <div id={this.props.id} onMouseDown={(e) => this.openWindow(e)} className="nodeDiv" style={{left: this.props.posX, top: this.props.posY}}>
                    <NodeWindow id={this.props.id}/>
                </div>
            )
        }
    }
}

export default Node;