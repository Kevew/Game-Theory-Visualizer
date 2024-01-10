import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../store/store';
import { useState } from "react";

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
            <h3>Current Amount of Nodes: {store.count}</h3>
            <h3>Strategy | Points</h3>
            <button onClick={() => dispatch({type: 'ADDPLAYER', name: inputName, color: inputColor})}>Add Player</button>
            <input type="text" onInput={(e) => setName((e.target as HTMLInputElement).value)} defaultValue={inputName} />
            <input type="text" onInput={(e) => setColor((e.target as HTMLInputElement).value)} defaultValue={inputColor} />
            {
                playerList.map((node, index) => (node[0] === "Empty") ? 
                                <h4 key={index}></h4> : <h4 key={index}>{node[0]}: {node[1].points}</h4>)
            }
        </div>
    )
}