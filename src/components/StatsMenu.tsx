import { useSelector } from "react-redux";
import { RootState } from '../store/store';

export const StatsMenu = () => {
    // Get the store information
    const store = useSelector((state: RootState) => state);
    // Get the playerList in the form of [key, value]
    const playerList = Object.entries(useSelector((state: RootState) => state.playerList));
    return(
        <div>
            <h3>Current Amount of Nodes: {store.count}</h3>
            <h3>Strategy | Points</h3>
            {
                playerList.map((node, index) => (node[0] === "Empty") ? 
                                <h4 key={index}></h4> : <h4 key={index}>{node[0]}: {node[1].points}</h4>)
            }
        </div>
    )
}