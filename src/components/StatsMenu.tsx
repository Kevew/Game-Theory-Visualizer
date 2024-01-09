import { useSelector } from "react-redux";
import { RootState } from '../store/store';

export const StatsMenu = () => {
    // Get the store information
    const store = useSelector((state: RootState) => state);
    // Get the strategyList in the form of [key, value]
    const strategyList = Object.keys(useSelector((state: RootState) => state.strategyList));
    return(
        <div>
            <h3>Current Amount of Nodes: {store.count}</h3>
            <h3>Strategy | Points</h3>
            {
                strategyList.map((node, index) => (node === "Empty") ? 
                                <h4 key={index}></h4> : <h4 key={index}>{node}: {store.pointsPerStrat[node]}</h4>)
            }
        </div>
    )
}