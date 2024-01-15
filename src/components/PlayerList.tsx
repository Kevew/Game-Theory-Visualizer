import React from "react";
import { State } from "../store/states";
import { connect } from "react-redux";
import { PlayerListElement } from "./PlayerListElement";

interface CanvasProps{
    playerList: [string, { 
                            cnt: number;
                            points: number;
                            colorAsso: string;
                        }][],
}

interface CanvasState{
    currentPlayerSelected: string | undefined,
}

class PlayerList extends React.Component<CanvasProps, CanvasState>{

    constructor(props: CanvasProps){
        super(props);
        this.state = {
            currentPlayerSelected: ""
        }
    }

    selectPlayer = (e: React.MouseEvent) => {
        let target = e.target as Element;
        if(target.textContent == undefined){
            return;
        }
        let playerName = target.textContent.slice(0, target.textContent.indexOf(':'));
        this.setState({
            currentPlayerSelected: playerName
        });
    }

    render(){
        return(
            <>
                {
                    this.props.playerList.map((node, index) => 
                        <PlayerListElement index={index} node={node} />)
                }
            </>
        )
    }
}

// Get the information from the store
const mapStateToProps = (state: State) => ({
    playerList: Object.entries(state.playerList)
});

export default connect(mapStateToProps)(PlayerList);