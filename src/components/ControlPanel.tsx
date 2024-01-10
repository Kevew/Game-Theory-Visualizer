import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";


const ControlPanel = () => {
    const dispatch = useDispatch<AppDispatch>();
    return(
        <>
            <button onClick={() => dispatch({type: "MODESELECTOR", mode: 1})}>Add/Edit Node</button>
            <button onClick={() => dispatch({type: "MODESELECTOR", mode: 2})}>Delete Node</button>
            <button onClick={() => dispatch({type: "MODESELECTOR", mode: 3})}>Connect Node</button>
        </>
    )
}


export default ControlPanel;