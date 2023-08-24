import { useState } from "react";

const ShowRoleToggle = ({actor, primary}) => {
    
    // console.log(actor.roles[1]);
    // var pos = primary;
    const [pos, setPos] = useState(primary)
    // console.log(pos);
    const [posDot, setPosDot] = useState(pos)

    function prev() {

        if (pos == 0) {
            setPos(actor.roles.length - 1);
            setPosDot(Math.min(13, size - 1));
            setBuffer(0);
        }
        else if (pos > 10) {
            if (posDot > 10) 
                setPosDot(posDot - 1);
            setBuffer(buffer + 1);
            setPos(pos - 1);
        }
        else {
            setPos(pos - 1);
            setPosDot(posDot - 1);
        }
    }
    function next() {
        if (pos == actor.roles.length - 1) {
            setPos(0);
            setPosDot(0);
            setBuffer(ext);
        }
        else if (posDot == 10 && buffer > 0 ) {
            setBuffer(buffer - 1);
            setPos(pos + 1)
            setPosDot(10);
        }
        else {
            setPos(pos + 1);
            setPosDot(posDot + 1);
        }
    }

    const size = actor.roles.length;
    const ext = size - 14;
    const [buffer, setBuffer] = useState(ext)
    // var buffer = ext;
    const arr = [];
    for (let i = 0; i < Math.min(size, 14); i++) {
        if (i == posDot)
            arr[i] = "⦿"
        else
            arr[i] = "◦";
    }
    console.log("pos", pos);
    console.log("posdot", posDot);
    console.log("buffer", buffer);
    console.log("size", size);
    console.log(actor.roles[pos].img);
    
    return ( 
        <div className="roleGallery">
            <div className="roleActor">
                <h3>{actor.name}</h3>
            </div>
            {console.log(actor.roles[pos].img)}
            <img src={actor.roles[pos].img} />
            <div className="imgNav">
                <button className="roleTogglePrev" onClick={prev}>←</button>
                <div className="selectionDots">{arr}</div>
                <button className="roleToggleNext" onClick={next}>→</button>
            </div>
            <h4>{actor.roles[pos].character}</h4>
            <p>{" from " + actor.roles[pos].show}</p>

        </div>
     );
}
 
export default ShowRoleToggle;