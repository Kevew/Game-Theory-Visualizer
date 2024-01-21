import React from "react";
import '../css/Canvas.css'
import Node from "./Node";
import { connect } from "react-redux";
import { State } from '../store/states';

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
    // What ID the next node will be
    nodeID: number;
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
}

// Offset for node placement
const offsetX: number = 50;
const offsetY: number = 50;

class Canvas extends React.Component<CanvasProps, CanvasState>{
    constructor(props: CanvasProps){
        super(props);
        this.state = {
            listOfNode: [],
            nodeID: 0,
            mouseX: 0,
            mouseY: 0,
            overNodeIndex: -1,
            moveState: -1,
            origMouseDown: [0, 0],
            changeInMouse: 0
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
                    listOfNode: newNodeList
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
                changeInMouse: 0
            })
        // Check if mouse is over anything else
        }else{
            this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                overNodeIndex: -2,
                moveState: -1
            })
        }
    }

    // When the mouse click is finally lifted up
    onMouseUpEvent = async(e: React.MouseEvent) => {
        let target = e.target as Element;
        await this.setState({
            mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
            mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
            moveState: -1
        })
        // Check if mouse is not over a node and if you have just moved it around
        if(this.state.overNodeIndex == -1 && this.state.changeInMouse <= 0 && this.props.mode == 1){
            // If none of the above, create a node and tell the store you created one
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
    }

    render(){
        return(
            <div data-test="canvas" className="canvas"
                                    onMouseDown={(e) => this.onMouseDownEvent(e)}
                                    onMouseUp={(e) => this.onMouseUpEvent(e)}
                                    onMouseMove={(e) => this.onMouseMoveEvent(e)}>
                {
                    this.state.listOfNode.map(node => (node.id === "-500") ? <></>:
                        <Node   key={node.key}
                                id={node.id}
                                posX={node.posX}
                                posY={node.posY}
                                mode={this.props.mode}
                                changedSince={this.state.changeInMouse}
                                curr_node={this.props.curr_node}/>)
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