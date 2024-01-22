import connectionArrowImg from '../assets/Connection.svg';

interface CanvasProps{
    posX: number;
    posY: number;
    rotateVal: number;
}

export const ArrowComponent = (props: CanvasProps) => {
    
    return(
        <img src={connectionArrowImg}
            className="arrowComponent"
            style={{left: props.posX, 
                    top: props.posY, 
                    transform: `rotate(${props.rotateVal}deg)`}}/>    
    )
}