import React from "react";
import '../css/Canvas.css'
import Node from "./Node";
import { connect } from "react-redux";
import { State } from '../store/states';
import { ArrowComponent } from "./ArrowComponent";

// The information that each node state will currently hold
interface NodeState {
    key: number;
    // A identifier to tell the difference between Node
    id: string;
    // It's position on the X axis relative to the canvas
    posX: number;
    // It's position on the Y axis relative to the canvas
    posY: number;
}

// The information that each connection arrow state will currently hold
interface ConnectionArrowState {
    id: number;
    // A identifier for first node
    fromNode: string;
    // A identifier for the second node
    toNode: string;
    
    // Is the connect set yet
    isConnected: boolean;
    // If the connection is not set yet, set it to the mouse
    // It's ori position on the X axis relative to the canvas
    posX: number;
    // It's ori position on the Y axis relative to the canvas
    posY: number;
    // Current rotation of arrow
    rotateVal: number;
    // It's true position on the X axis relative to the canvas
    truePosX: number;
    // It's true position on the Y axis relative to the canvas
    truePosY: number;
}

interface CanvasProps {
    // Current Node Manipulation Mode
    // 1 - Add/Edit Node
    // 2 - Delete Node
    // 3 - Connect Nodes
    mode: number;
    // Allows communications/dispatchs to store
    dispatch: Function;
    // Current Node the simulation is at
    curr_node: number;
}

interface CanvasState {
    // The current list of nodes in the canvas
    listOfNode: NodeState[];
    // The current list of connections in the canvas
    listOfConnection: ConnectionArrowState[];
    // What ID the next node will be
    nodeID: number;
    // What ID the next connectionArrow will be
    arrowID: number;
    // Current mouse position
    mouseX: number;
    mouseY: number;
    // Check which node the mouse is currently over
    overNodeIndex: number;


    /* Variables for canvas movement  */
    // Determine whether to move one node or all the nodes at once
    moveState: number;
    // Determine movement and stuff
    origMouseDown: [number, number];
    changeInMouse: number;


    // Is creating a connection between two nodes
    connectState: number;
}

// Offset for node placement
const offsetX: number = 50;
const offsetY: number = 50;

class Canvas extends React.Component<CanvasProps, CanvasState>{
    constructor(props: CanvasProps){
        super(props);
        this.state = {
            listOfNode: [],
            listOfConnection: [],
            nodeID: 0,
            arrowID: 0,
            mouseX: 0,
            mouseY: 0,
            overNodeIndex: -1,
            moveState: -1,
            origMouseDown: [0, 0],
            changeInMouse: 0,
            connectState: -1
        }
    }

    // Move a specific node around
    moveSelectedNode = (nodeIndex: number, xMove: number, yMove: number) => {
        this.setState(prevstate => ({
            listOfNode: [...this.state.listOfNode.slice(0, nodeIndex), 
                        {
                            ...this.state.listOfNode[nodeIndex],
                            posX: xMove,
                            posY: yMove,
                        },
                        ...this.state.listOfNode.slice(nodeIndex + 1)],
            changeInMouse: prevstate.changeInMouse + 0.01
        }));
    }

    // Move all the nodes around at once
    moveAll = (origX: number, origY: number, changeX: number, changeY: number) => {
        let newList = this.state.listOfNode;
        for(let i = 0;i < newList.length;i++){
            newList[i] = {
                ...newList[i],
                posX: newList[i].posX + (changeX - origX),
                posY: newList[i].posY + (changeY - origY)
            }
        }
        this.setState(prevState => ({
            listOfNode: newList,
            origMouseDown: [changeX, changeY],
            changeInMouse: prevState.changeInMouse + Math.abs(changeX - origX) + Math.abs(changeY - origY)
        }));
    }

    // This function gets called when mouse gets clicked down and only down
    onMouseDownEvent = (e: React.MouseEvent) => {
        let target = e.target as Element;
        // Check if mouse is at a node
        if(target.className == "bottemHalfCircle" || target.className == "topHalfCircle"){
            // If edit mode, then start moving it
            let targetID = target.parentElement ? target.parentElement.id : undefined;
            if(this.props.mode == 1){
                const nodeIndex = this.state.listOfNode.findIndex(node => node.id === targetID);
                this.setState({
                    mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                    mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                    overNodeIndex: nodeIndex,
                    moveState: 1,
                    changeInMouse: 0
                })
                // Check if props
            }else if(this.props.mode == 2){
                const nodeID = this.state.listOfNode.find(node => node.id === targetID)?.id;
                this.props.dispatch({
                    type: "DELETENODE",
                    node_id: nodeID
                });
                let newNodeList = this.state.listOfNode;
                newNodeList.splice(newNodeList.findIndex(node => node.id === targetID), 1);
                this.setState({
                    listOfNode: newNodeList,
                })
            }
        // Check if mouse is over canvas
        }else if(target.className == "canvas"){
            this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                overNodeIndex: -1,
                moveState: 2,
                origMouseDown: [e.clientX - target.getBoundingClientRect().left - offsetX,
                                e.clientY - target.getBoundingClientRect().top - offsetY],
                changeInMouse: 0,
                connectState: -1
            })
        // Check if mouse is over anything else
        }else{
            this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                overNodeIndex: -2,
                moveState: -1,
                connectState: -1
            })
        }
    }

    // When the mouse click is finally lifted up
    onMouseUpEvent = async(e: React.MouseEvent) => {
        let target = e.target as Element;
        if(this.state.overNodeIndex >= 0 && this.state.changeInMouse <= 0 && this.props.mode == 3){
            // Check if player wants to create a connection
            if(this.state.connectState === -1){
                // Select first node
                let valID = Number((target.parentElement as Element).id);
                await this.setState({
                    mouseX: this.state.listOfNode[valID].posX,
                    mouseY: this.state.listOfNode[valID].posY,
                    moveState: -1
                })
                
                this.setState(prevState => ({
                    listOfConnection: [...this.state.listOfConnection, 
                                        {id: this.state.arrowID,
                                        fromNode: target.id,
                                        toNode: "-1",
                                        isConnected: false,
                                        rotateVal: 0,
                                        posX: this.state.mouseX,
                                        posY: this.state.mouseY,
                                        truePosX: this.state.mouseX,
                                        truePosY: this.state.mouseY}],
                    arrowID: prevState.arrowID + 1,
                    connectState: Number(prevState.arrowID)
                }));
            }else{
                // Select second node
                let valID = (target.parentElement as Element).id;
                this.setState({
                    listOfConnection: [...this.state.listOfConnection.slice(0, this.state.connectState),
                                        {
                                            ...this.state.listOfConnection[this.state.connectState],
                                            toNode: valID
                                        },
                                        ...this.state.listOfConnection.slice(this.state.connectState + 1)],
                    connectState: -1
                });
            }
            console.log(this.state);
        }else if(this.state.overNodeIndex == -1 && 
            this.state.changeInMouse <= 0 && 
            this.props.mode == 1 &&
            this.state.connectState == -1){
            // Check if mouse is not over a node and if you have just moved it around
            // If none of the above, create a node and tell the store you created one
            await this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                moveState: -1
            })
            this.props.dispatch({ type: 'INCREMENT', node_id: this.state.nodeID.toString() })
            this.setState(prevState => ({
                listOfNode: [...this.state.listOfNode, {key: this.state.nodeID,
                                                        id: this.state.nodeID.toString(),
                                                        posX: this.state.mouseX,
                                                        posY: this.state.mouseY}],
                nodeID: prevState.nodeID + 1,
                overNodeIndex: prevState.nodeID
            }));
        }
        this.setState({
            moveState: -1
        })
    }

    // When the mouse moves, this function is called
    onMouseMoveEvent = (e: React.MouseEvent) => {
        let target = e.target as Element;
        if(target.className == "bottemHalfCircle" || target.className == "topHalfCircle"){
            target = (target.parentElement as Element).parentElement as Element;
        }else if(target.className == "nodeWindowDiv"){
            target = ((target.parentElement as Element).parentElement as Element).parentElement as Element;
        }
        // Move all the nodes at once
        if(this.state.moveState == 2){
            let changeX = e.clientX - target.getBoundingClientRect().left - offsetX;
            let changeY = e.clientY - target.getBoundingClientRect().top - offsetY;
            let origX = this.state.origMouseDown[0];
            let origY = this.state.origMouseDown[1];
            this.moveAll(origX, origY, changeX, changeY);
        // Move only 1 node at a time
        }else if(this.state.moveState == 1){
            let x = e.clientX - target.getBoundingClientRect().left - offsetX;
            let y = e.clientY - target.getBoundingClientRect().top - offsetY;
            this.moveSelectedNode(this.state.overNodeIndex, x, y)
        }



        // Move connection if possible
        if(this.state.connectState != -1){
            // Calculate New Angle
            let mouseX = e.clientX - target.getBoundingClientRect().left - offsetX;
            let mouseY = e.clientY - target.getBoundingClientRect().top - offsetY;
            let oldVal = this.state.listOfConnection[this.state.connectState];
            let newRotateVal = Math.atan2(mouseY - oldVal.posY, mouseX - oldVal.posX) * 180 / Math.PI;

            // Calculate New Position
            let newPosX = (mouseX + oldVal.posX)/2;
            let newPosY = (mouseY + oldVal.posY)/2;

            this.setState({
                listOfConnection: [...this.state.listOfConnection.slice(0, this.state.connectState),
                                    {
                                        ...this.state.listOfConnection[this.state.connectState],
                                        rotateVal: newRotateVal,
                                        truePosX: newPosX,
                                        truePosY: newPosY
                                    },
                                    ...this.state.listOfConnection.slice(this.state.connectState + 1)],
            });
        }
    }

    render(){
        return(
            <div data-test="canvas" className="canvas"
                                    onMouseDown={(e) => this.onMouseDownEvent(e)}
                                    onMouseUp={(e) => this.onMouseUpEvent(e)}
                                    onMouseMove={(e) => this.onMouseMoveEvent(e)}>
                {
                    this.state.listOfNode.map(node => 
                        <Node   key={node.key}
                                id={node.id}
                                posX={node.posX}
                                posY={node.posY}
                                mode={this.props.mode}
                                changedSince={this.state.changeInMouse}
                                curr_node={this.props.curr_node}/>)
                }
                {
                    this.state.listOfConnection.map(node =>
                        <ArrowComponent 
                            posX={node.truePosX} 
                            posY={node.truePosY}
                            rotateVal={node.rotateVal}/>)
                }
            </div>
        )
    }
}

// Get the information from the store
const mapStateToProps = (state: State) => ({
    mode: state.mode,
    curr_node: state.currentNode
});
  
// Connect the component to the store
export default connect(mapStateToProps)(Canvas);