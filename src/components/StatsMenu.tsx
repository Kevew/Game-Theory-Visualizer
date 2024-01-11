import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../store/store';
import { useState } from "react";
import '../css/StatsMenu.css';

export const StatsMenu = () => {
    // Get the store information
    const store = useSelector((state: RootState) => state);
    // Get the playerList in the form of [key, value]
    const playerList = Object.entries(useSelector((state: RootState) => state.playerList));
    // Add connection to store so it can call dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get name of new player
    const [inputName, setName] = useState("John");
    // Get color of new player
    const [inputColor, setColor] = useState("#111111");
    return(
        <div> 
            <h3 className="nodeCount">Current Amount of Nodes: {store.count}</h3>
            <h3 className="statsHeader">Strategy | Points</h3>
            <button className="addPlayerButton" onClick={() => dispatch({type: 'ADDPLAYER', name: inputName, color: inputColor})}>Add Player</button>
            <input className="nameTextbox" type="text" onInput={(e) => setName((e.target as HTMLInputElement).value)} defaultValue={inputName} />
            <input className="colorTextbox" type="text" onInput={(e) => setColor((e.target as HTMLInputElement).value)} defaultValue={inputColor} />
            {
                playerList.map((node, index) => <h4 className="pointTrack" key={index}>{node[0]}: {node[1].points}</h4>)
            }
        </div>
    )
}