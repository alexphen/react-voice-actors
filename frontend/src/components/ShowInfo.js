import { useEffect, useState } from "react";
import ShowRoleToggle from "./ShowRoleToggle";
import { useParams } from "react-router-dom";

const   CharName    = 0,
        Favorites   = 1,
        ActorID     = 2,
        ActorName   = 3;

var toggles = [];
var set = false;

const ShowInfo = ({ user, myList, flag }) => {

    // console.log(Show)

    const {id, Title} = useParams();
    const [showSelected, setShowSelected] = useState([id || 0, Title || ""])
    const [actors, setActors] = useState([]);
    const getShowActors = async() => {
        const showData = await fetch ('/show', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ShowID: id
          })
        })
        .then(res => res.json());
        for (let i in showData) {
            showData[i] = Object.values(showData[i]);
        }
        setActors(showData)
    }

    useEffect(() => {
        // console.log(id)
        if (id > 0) {
            setShowSelected([id, Title])
            getShowActors();
            set = true;
        }
    }, [id]);

    // useEffect(() => {
    //     getShowActors();
    // }, [Show]);
    
    // useEffect(() => {
    //     // removeDups();
    // }, [actors]);


    function bubbleSortActors(acts, n) {
        var i, j, temp;
        var swapped;
        // console.log(n)
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) {
                if (acts[j][Favorites] < acts[j + 1][Favorites]) {
                        // Swap arr[j] and arr[j+1]
                        temp = acts[j];
                        acts[j] = acts[j + 1];
                        acts[j + 1] = temp;
                        swapped = true;
                }
            } 
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped === false)
                break;
        }
    }
 
    function removeDups() {
        var actorIDs = [];
        for (var i in actors) {
            // console.log(actors[i].ActorID)
            // console.log(actorIDs)
            if (actorIDs.includes(actors[i][ActorID])) {
                actors.splice(i, 1);
                i--;
            }
            else {
                actorIDs.push(actors[i][ActorID])
            }
        }
    }

    return (  
        <>
            {/* {console.log("rendered")} */}
            {/* <h1 className="showTitle">{Title}</h1> */}
            <div className="showInfo">
                {removeDups()}
                {bubbleSortActors(actors, actors.length)}
                {actors.length > 0 && set
                    ? actors.map((actor, n) => 
                        <div key={actor[ActorID]}>
                            {/* {console.log("toggle", actor[ActorID])} */}
                            <ShowRoleToggle actorID={actor[ActorID]}
                                            actorName={actor[ActorName]}
                                            showID={id}
                                            flag={flag}
                                            user={user}
                                            myList={myList}/>
                        </div>
                    )
                    : <>
                        <p>Failed to load from API :(</p>        
                      </>
                }
            </div>
        </>
    );

    function getToggles() {
        console.log("called toggles")
        let arr = [];
        for (let i in actors) {
            let actor = actors[i];
            console.log(actor);
            arr.push(<ShowRoleToggle actorID={actor[ActorID]}
                                     actorName={actor[ActorName]}
                                     showID={id}/>)
        } 
        return arr;
    }
}
 
export default ShowInfo;