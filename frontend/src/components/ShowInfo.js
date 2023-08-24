import { useEffect, useState } from "react";
import ShowRoleToggle from "./ShowRoleToggle";
import { act } from "react-dom/test-utils";


const ShowInfo = ({Show}) => {

    console.log(Show)

    const [ShowID, Title] = Show;
    const [returnedData, setReturnedData] = useState([]);
    const [roleReturn, setRoleReturn] = useState([]);
    const [actors, setActors] = useState([]);

    const getShowActors = async() => {
        const showData = await fetch ('/show', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ShowID: ShowID
          })
        })
        .then(res => res.json());
        console.log(showData)
        setReturnedData(showData);
    }

    useEffect(() => {
        getShowActors();
    }, []);

    useEffect(() => {
        getShowActors();
    }, [Show]);
    
    useEffect(() => {
        // removeDups();
    }, [returnedData]);

    var ids = [];
    var index = 0;
    var roleOrder = [];
    
    var keys = [];

    function bubbleSortActors(acts, n) {
        var i, j, temp;
        var swapped;
        // console.log(n)
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) {
                if (acts[j].Favorites < acts[j + 1].Favorites) {
                        // Swap arr[j] and arr[j+1]
                        temp = acts[j];
                        acts[j] = acts[j + 1];
                        acts[j + 1] = temp;
                        swapped = true;
                }
            } 
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped == false)
            break;
        }
    }
 
    function removeDups() {
        var actorIDs = [];
        for (var i in returnedData) {
            // console.log(returnedData[i].ActorID)
            // console.log(actorIDs)
            if (actorIDs.includes(returnedData[i].ActorID)) {
                returnedData.splice(i, 1);
                i--;
            }
            else {
                actorIDs.push(returnedData[i].ActorID)
            }
        }
    }

    return (  
        <>
            <h1 className="showTitle">{Title}</h1>
            <div className="showInfo">
                {removeDups()}
                {bubbleSortActors(returnedData, returnedData.length)}
                {/* {console.log(returnedData)} */}
                {returnedData.length > 0
                    ? Object.entries(returnedData).map((actor, n) => 
                        <div>
                            <ShowRoleToggle key={actor[1].ActorID} actorID={actor[1].ActorID} actorName={actor[1].ActorName} showID={ShowID}/>
                        </div>
                    )  
                    : <>
                        {console.log(actors)}
                        <p>{actors}</p>        
                      </>
                }
            </div>
        </>
    );
}
 
export default ShowInfo;