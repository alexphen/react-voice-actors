import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Show from "../pages/Show";

const CharID = 0;
const CharName = 1;
const Favorites = 2;
const ImageURL = 3;
// const ActorID = 4;
const ShowID = 5;
const Title = 7;

const ShowRoleToggle = ({actorID, actorName, showID}) => {

    // console.log("actorID received ", actorID)
    
    const [pos, setPos] = useState(0);
    const [posDot, setPosDot] = useState(pos);
    const [roleReturn, setRoleReturn] = useState([]);
    // const [roles, setRoles] = useState([]);
    var size;
    var ext;
    var prev;

    useEffect(() => {
        // console.log(actorID)
        if (prev != actorID) {
            prev = actorID;
            // console.log("getting roles", actorID)
            getRoles(actorID);
            restart();
        }
    }, [actorID]);

    useEffect(() => {
        restart();
    }, [showID])

    // useEffect(() => {
    //     getRoles(actorID);
    // }, []);
    
    const getRoles = async(actID) => {
        // console.log("ID sent to roles ", actID)
        const roleData = await fetch ('/roles', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ActorID: actID
            })
        }).then(res => res.json())
        if (roleData[0].CharName) {
            for (let i in roleData) {
                roleData[i] = Object.values(roleData[i])
            }
        }
        setRoleReturn(Object.values(roleData));
        // console.log("rd", Object.values(roleData))
        // actors[actors.length] = roleData;
    }

    // useEffect(() => {
    //     setNumRoles(countRoles(roles, roles.length));
    //     console.log("numRoles", numRoles)
    // }, [pos, actor]);

    // console.log("pos ", pos);

    function restart() {
        setPos(0);
        setPosDot(0);
    }

    function prev() {
        // console.log("buffer ", buffer, "posDot ", posDot, "pos ", pos, "ext ", ext)

        if (pos === 0) {
            setPos(size - 1);
            setPosDot(Math.min(9, size - 1));
            
        }
        else if (pos > 7) {
            if (posDot > 7) 
            setPosDot(posDot - 1);
        setPos(pos - 1);
    }
    else {
        setPos(pos - 1);
        setPosDot(posDot - 1);
    }
}
function next() {
    // console.log("buffer ", buffer, "posDot ", posDot, "pos ", pos, "ext ", ext)
    // end of line
    if (pos === size - 1) {
        setPos(0);
        setPosDot(0);
    }
    // pause at buffer
    else if (posDot === 7 && size - pos > 3 ) {
        setPos(pos + 1)
    }
    // press on
    else {
        setPos(pos + 1);
        setPosDot(posDot + 1);
        // console.log('posDot', posDot)
        // console.log('pos', pos)
        // console.log('size', size)
        // console.log('rr', roleReturn)
    }
} 

    // function showShows(titles) {
    //     console.log(titles);
    //     <MoreShows titles={titles} />
    // }

  
    // console.log('size', size)
    // console.log('ext', ext)
    // var buffer = ext;
    const arr = [];
    // for (let i = 0; i < Math.min(size, 10); i++) {
    //     if (i === posDot)
    //         arr[i] = "⦿"
    //     else
    //         arr[i] = "◦";
    // }
    
    return ( 
        
        <div className="roleGallery">
            <div className="roleActor">
                <h3>
                    <Link to={`/Actor/${actorID}`}>{actorName}</Link>
                </h3>
            </div>
            <div>
                {pos < roleReturn.length
                    ? <>{handleRoles()}
                    <img src={roleReturn[pos][ImageURL]} alt={roleReturn[pos][CharName]} />
                    <div className="imgNav">
                        {size > 1
                            ?<button className="roleTogglePrev" onClick={prev}>←</button>
                            :<></>
                        }
                        <div className="selectionDots">
                            {arr}
                            <br></br>
                            <span className="index"> {pos + 1} of {size} </span>  
                        </div>
                        {size > 1
                            ?<button className="roleToggleNext" onClick={next}>→</button>
                            :<></>
                        }
                    </div>
                    <h4>{roleReturn[String(pos)][CharName]}</h4>
                    <div className="showsList">
                        {roleReturn[pos][Title] ?
                        <>
                        {/* <p>from </p> */}
                        {roleReturn[pos][Title].map((title, n) => 
                            <div key={n}>
                                <Link to={`/Show/${roleReturn[pos][ShowID][n]}/${title}`}>{title}</Link>
                            </div>
                        )}</>
                            : <></>
                        }
                    </div> 
                    </>
                    : <></>
                }
                
            </div>

        </div>
     );

     function handleShowClick(show) {
        Show.setShowSelected(show);
     }

     function handleRoles() {
        combineRoles();
        bubbleSort(roleReturn, roleReturn.length);
        findPrimary();
     }

     function combineRoles() {
        var currRoleShowIDs = [];
        var currRoleTitles = [];
        // console.log(roleReturn)
        for (let i = 0; i < roleReturn.length; i++) {
            if (typeof roleReturn[i][Title] == 'string') {
                currRoleShowIDs = [roleReturn[i][ShowID]];
                currRoleTitles = [roleReturn[i][Title]];
                // var currRoleShowIDs = [roleReturn[i].ShowID];
                // var currRoleTitles = [roleReturn[i].Title];
            }
            else {
                currRoleShowIDs = roleReturn[i][ShowID];
                currRoleTitles = roleReturn[i][Title];
            }
            for (let p = i + 1; p < roleReturn.length; p++) {
                if(roleReturn[i][CharID] === roleReturn[p][CharID]) {
                    // console.log(currRoleShowIDs)
                    currRoleShowIDs.push(roleReturn[p][ShowID]);
                    currRoleTitles.push(roleReturn[p][Title]);
                    // console.log(currRoleTitles)
                    roleReturn.splice(p, 1);
                    p--;
                }
                else {
                    i = p - 1;
                    break
                }
            }
            roleReturn[i][ShowID] = currRoleShowIDs;
            roleReturn[i][Title] = currRoleTitles;
        }
        size = roleReturn.length;
        ext = size - 10;
        for (let i = 0; i < Math.min(size, 10); i++) {
            if (i === posDot)
                arr[i] = "⦿"
            else
                arr[i] = "◦";
        }
    }

    function bubbleSort(roles, n)
    {
        // roleOrder = [];
        // for (var i in roles) {
        //     roleOrder.push(i)
        // }
        var i, j, temp;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (roles[j][Favorites] < roles[j + 1][Favorites]) 
                {
                    // Swap arr[j] and arr[j+1]
                    temp = roles[j];
                    roles[j] = roles[j + 1];
                    roles[j + 1] = temp;
                    swapped = true;
                }
            }
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped === false)
            break;
        }
    }

    function findPrimary() {
        // if multiple roles
        if (roleReturn.length > 1) {
            var num = 0;
            // console.log(roleReturn)
            for (var k in roleReturn) {
                // console.log(roleReturn[k])
                // console.log(roleReturn[k][ShowID])
                if (roleReturn[k][ShowID].includes(parseInt(showID))) {
                    
                    var temp = roleReturn[k];
                    roleReturn.splice(k, 1);
                    roleReturn.splice(num, 0, temp);
                    num++;
                }
            }
        }
    }   

    //  function countRoles(roleReturn, n) {
    //     let res = 0;
    //     console.log(roleReturn)
    //     for (let i = 0; i < n; i++) {
    //         // skip ahead on duplicates
    //         console.log(i)
    //         while (i < n - 1 && roleReturn[i].CharID === roleReturn[i+1].CharID) {
    //             console.log(roleReturn[i+1])
    //             i++;
    //         }
    //         res++;
    //     }
    //     return res;
    //  }
}
 
export default ShowRoleToggle;