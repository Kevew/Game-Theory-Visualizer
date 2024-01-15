import '../css/TopBar.css';
import ControlPanel from './ControlPanel';
import Visualization from './Visualization';

export const TopBar = () => {
    return(
        <>
            <div className="controlPanelDiv">
                <ControlPanel />
                <Visualization />
            </div>
        </>
    )
}