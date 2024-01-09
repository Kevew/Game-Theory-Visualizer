import { useSelector } from "react-redux";
import { RootState } from '../store/store';

export const StatsMenu = () => {
    const count = useSelector((state: RootState) => state.count);
    const strategyList = Object.keys(useSelector((state: RootState) => state.strategyList)).map((key) => key);
    return(
        <div>
            <h3>Current Amount of Nodes: {count}</h3>
            <h3>Strategy   Points</h3>
            {
                strategyList.map((node, index) => (node === "Empty") ? <h4 key={index}></h4> : <h4 key={index}>{node}: POINTS</h4>)
            }
        </div>
    )
}