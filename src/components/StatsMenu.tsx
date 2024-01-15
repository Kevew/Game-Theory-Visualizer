import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../store/store';
import { useState } from "react";
import '../css/StatsMenu.css';
import PlayerList from "./PlayerList";

export const StatsMenu = () => {
    // Get the store information
    const store = useSelector((state: RootState) => state);
    // Add connection to store so it can call dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get name of new player
    const [inputName, setName] = useState("John");
    // Get color of new player
    const [inputColor, setColor] = useState("#FFFFFF");
    
    return(
        <div> 
            <h3 className="nodeCount">Current Amount of Nodes: {store.count}</h3>
            <h3 className="statsHeader">Player | Points</h3>
            <button className="addPlayerButton" onClick={() => dispatch({type: 'ADDPLAYER', name: inputName, color: inputColor})}>Add Player</button>
            <input className="nameTextbox" type="text" onInput={(e) => setName((e.target as HTMLInputElement).value)} defaultValue={inputName} />
            <input className="colorTextbox" type="text" onInput={(e) => setColor((e.target as HTMLInputElement).value)} defaultValue={inputColor} />
            <div className="playerListDiv">
                <PlayerList/>
            </div>
        </div>
    )
}