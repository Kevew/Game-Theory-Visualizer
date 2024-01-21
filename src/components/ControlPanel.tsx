import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useState } from "react";


const ControlPanel = () => {
    const [activeLink, setActiveLink] = useState(1);
    const dispatch = useDispatch<AppDispatch>();

    function mode_selector(value: number){
        dispatch({type: "MODESELECTOR", mode: value});
        setActiveLink(value);
    }

    return(
        <>
            <button className={(activeLink === 1)? "activeMode" : ""} onClick={() => mode_selector(1)}>Add/Edit Node</button>
            <button className={(activeLink === 2)? "activeMode" : ""} onClick={() => mode_selector(2)}>Delete Node</button>
            <button className={(activeLink === 3)? "activeMode" : ""} onClick={() => mode_selector(3)}>Connect Node (WIP)</button>
        </>
    )
}


export default ControlPanel;