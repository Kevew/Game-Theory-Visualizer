interface CanvasProps{
    index: number,
    node: [string, { 
            cnt: number;
            points: number;
            colorAsso: string;
        }]
}

export const PlayerListElement = (props: CanvasProps) => {

    return(
        <div> 
            <div className="smallPlayerBox" style={{background: props.node[1].colorAsso}}></div>
            <div className="playerPointDiv">
                <h4 className={"pointTrack " + props.index} key={props.index}>{props.node[0]}: {props.node[1].points}</h4>
            </div>
        </div>
    )
}