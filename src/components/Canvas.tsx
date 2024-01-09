import React from "react";
import '../css/Canvas.css'
import Node from "./Node";
import { connect } from "react-redux";
import { State } from '../store/states';

// The information that each node state will currently hold
interface NodeState {
    key: number;
    id: string;
    posX: number;
    posY: number;
}  

interface CanvasProps {
    dispatch: Function;
}

interface CanvasState {
  over: boolean;
  listOfNode: NodeState[];
  nodeID: number;
  mouseX: number;
  mouseY: number;
  overNodeIndex: number;


  moveState: number;
  origMouseDown: [number, number];
  changeInMouse: number;
}

const offsetX: number = 50;
const offsetY: number = 50;

class Canvas extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
        this.state = {
            over: false,
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

    componentDidMount(){
        // Adds event listener for mouseclick
        window.addEventListener("click", this.mouseClick)
    }

    // What to do when mouse is clicked
    mouseClick = () => {
        // Check if mouse is over canvas
        if(this.state.over){
            // Check if mouse is not over a node and if you have just moved it around
            if(this.state.overNodeIndex == -1 && this.state.changeInMouse <= 0){
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
        }else{
            console.log("Not Over");
        }
    }

    moveSelectedNode = (nodeIndex: number, xMove: number, yMove: number) => {
        this.setState({
            listOfNode: [...this.state.listOfNode.slice(0, nodeIndex), 
                        {
                            ...this.state.listOfNode[nodeIndex],
                            posX: xMove,
                            posY: yMove,
                        },
                        ...this.state.listOfNode.slice(nodeIndex + 1)]
        });
    }

    moveAll = (origX: number, origY: number, changeX: number, changeY: number) => {
        let newList = this.state.listOfNode
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

    onMouseDownEvent = (e: React.MouseEvent) => {
        let target = e.target as Element;
        if(target.className == "nodeDiv"){
            const nodeIndex = this.state.listOfNode.findIndex(node => node.id === target.id);
            this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                overNodeIndex: nodeIndex,
                moveState: 1
            })
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
        }else{
            this.setState({
                mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
                mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
                overNodeIndex: -2,
                moveState: -1
            })
        }
    }

    onMouseUpEvent = (e: React.MouseEvent) => {
        let target = e.target as Element;
        this.setState({
            mouseX: e.clientX - target.getBoundingClientRect().left - offsetX,
            mouseY: e.clientY - target.getBoundingClientRect().top - offsetY,
            moveState: -1
        })
    }

    onMouseMoveEvent = (e: React.MouseEvent) => {
        let target = e.target as Element;
        if(target.className == "nodeDiv"){
            target = target.parentElement as Element;
        }
        if(this.state.moveState == 2){
            let changeX = e.clientX - target.getBoundingClientRect().left - offsetX;
            let changeY = e.clientY - target.getBoundingClientRect().top - offsetY;
            let origX = this.state.origMouseDown[0];
            let origY = this.state.origMouseDown[1];
            this.moveAll(origX, origY, changeX, changeY)
        }else if(this.state.moveState == 1){
            let x = e.clientX - target.getBoundingClientRect().left - offsetX;
            let y = e.clientY - target.getBoundingClientRect().top - offsetY;
            this.moveSelectedNode(this.state.overNodeIndex, x, y)
        }
    }

    render(){
        return(
            <div className="canvas" onMouseEnter={() => this.setState({over: true})} 
                                    onMouseLeave={() => this.setState({over: false})}
                                    onMouseDown={(e) => this.onMouseDownEvent(e)}
                                    onMouseUp={(e) => this.onMouseUpEvent(e)}
                                    onMouseMove={(e) => this.onMouseMoveEvent(e)}>
                {
                    this.state.listOfNode.map(node => 
                        <Node key={node.key} id={node.id} posX={node.posX} posY={node.posY}/>)
                }
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({});
  
// Connect the component to the store
export default connect(mapStateToProps)(Canvas);