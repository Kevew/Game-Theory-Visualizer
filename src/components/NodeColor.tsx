interface CanvasProps{
    // Color of area
    color: string;
    // Top or Bottem
    pos: boolean;
}

export const NodeColor = (props: CanvasProps) => {
    if(props.pos){
        // Top Color
        return(
            <div className="topHalfCircle" style={{backgroundColor: props.color, left: -2, top: -2}}></div>
        )
    }else{
        // Bottem Color
        return(
            <div className="bottemHalfCircle" style={{backgroundColor: props.color, left: -2, top: 48}}></div>
        )
    }
}