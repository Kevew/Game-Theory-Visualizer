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

    // All the node ids that are connected TO this node
    toNodeConnect: string[];
    // All the node ids that are connected FROM this node
    fromNodeConnect: string[];
}

// The information that each connection arrow state will currently hold
interface ConnectionArrowState {
    id: string;
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
        // Updates the specific node
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

        // Get the list of connections so that it updates all the ones connected to that node
        let newListOfConnection = this.state.listOfConnection;

        let listToNode = this.state.listOfNode[nodeIndex].toNodeConnect;

        // Calculate new positions for to arrows
        for(let i = 0;i < listToNode.length;i++){

            let valID = this.state.listOfConnection.findIndex(connect => connect.id === listToNode[i]);

            let fromNodeID = this.state.listOfConnection[valID].fromNode;
            // Calculate New Angle
            let oldVal = this.state.listOfNode[this.state.listOfNode.findIndex(current => current.id === fromNodeID)];
            let newRotateVal = Math.atan2(yMove - oldVal.posY, xMove - oldVal.posX) * 180 / Math.PI;

            // Calculate New Position
            let newPosX = (xMove + oldVal.posX - 50)/2;
            let newPosY = (yMove + oldVal.posY)/2;

            newListOfConnection[valID].truePosX = newPosX;
            newListOfConnection[valID].truePosY = newPosY;
            newListOfConnection[valID].rotateVal = newRotateVal;
        }
        // Calculate new positions for from arrows
        listToNode = this.state.listOfNode[nodeIndex].fromNodeConnect;
        for(let i = 0;i < listToNode.length;i++){
            
            let currentNodeID = this.state.listOfConnection.findIndex(connect => connect.id === listToNode[i]);
            let toNodeID = this.state.listOfConnection[currentNodeID].toNode;
            let fromNodeID = this.state.listOfConnection[currentNodeID].fromNode;

            let toVal = this.state.listOfNode[this.state.listOfNode.findIndex(current => current.id === toNodeID)];
            let oldVal = this.state.listOfNode[this.state.listOfNode.findIndex(current => current.id === fromNodeID)];
            let newRotateVal = Math.atan2(toVal.posY - oldVal.posY, toVal.posX - oldVal.posX) * 180 / Math.PI;
            
            let newPosX = (toVal.posX + oldVal.posX)/2;
            let newPosY = (toVal.posY + oldVal.posY)/2;

            newListOfConnection[currentNodeID].truePosX = newPosX;
            newListOfConnection[currentNodeID].truePosY = newPosY;
            newListOfConnection[currentNodeID].rotateVal = newRotateVal;
        }

        this.setState({
            listOfConnection: newListOfConnection
        })
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
        let newArrowList = this.state.listOfConnection;
        for(let i = 0;i < newArrowList.length;i++){
            newArrowList[i] = {
                ...newArrowList[i],
                truePosX: newArrowList[i].truePosX + (changeX - origX),
                truePosY: newArrowList[i].truePosY + (changeY - origY)
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
        // Check if player wants to create a connection
        if(this.state.overNodeIndex >= 0 && this.state.changeInMouse <= 0 && this.props.mode == 3){
            if(this.state.connectState === -1){
                // Select first node
                let valID = Number((target.parentElement as Element).id);
                await this.setState({
                    mouseX: this.state.listOfNode[valID].posX,
                    mouseY: this.state.listOfNode[valID].posY,
                    moveState: -1
                })

                let newListofNode = this.state.listOfNode;
                newListofNode[Number(valID)].fromNodeConnect.push(this.state.arrowID.toString());
                
                this.setState(prevState => ({
                    listOfConnection: [...this.state.listOfConnection, 
                                        {id: this.state.arrowID.toString(),
                                        fromNode: prevState.arrowID.toString(),
                                        toNode: "-1",
                                        isConnected: false,
                                        rotateVal: 0,
                                        posX: this.state.mouseX,
                                        posY: this.state.mouseY,
                                        truePosX: this.state.mouseX,
                                        truePosY: this.state.mouseY}],
                    listOfNode: newListofNode,
                    arrowID: prevState.arrowID + 1,
                    connectState: Number(prevState.arrowID)
                }));
            }else{
                // Select second node
                let valID = (target.parentElement as Element).id;

                let newListofNode = this.state.listOfNode;
                newListofNode[Number(valID)].toNodeConnect.push(this.state.connectState.toString());

                this.setState({
                    listOfConnection: [...this.state.listOfConnection.slice(0, this.state.connectState),
                                        {
                                            ...this.state.listOfConnection[this.state.connectState],
                                            toNode: valID
                                        },
                                        ...this.state.listOfConnection.slice(this.state.connectState + 1)],
                    listOfNode: newListofNode,
                    connectState: -1
                });
            }
        }else if(this.state.overNodeIndex == -1 && 
            this.props.mode == 3 && 
            this.state.connectState >= 0){
            // Check if click is over canvas and is currently trying to place connection
            
            
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
                                                        posY: this.state.mouseY,
                                                        toNodeConnect: [],
                                                        fromNodeConnect: []}],
                nodeID: prevState.nodeID + 1,
                overNodeIndex: prevState.nodeID
            }));
        }
        this.setState({
            moveState: -1,
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
                                curr_node={this.props.curr_node}
                                topPlayerColour=""
                                bottemPlayerColour=""/>)
                }
                {
                    this.state.listOfConnection.map(node =>
                        <ArrowComponent
                            key={node.id + 1000000}
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