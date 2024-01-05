import React from "react";
import '../css/NodeWindow.css';

interface CanvasProps {

}

interface CanvasState {
    
}


class NodeWindow extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
    }

    render(){
        return(
            <div className="nodeWindowDiv">
                
            </div>
        )
    }
}

export default NodeWindow;