import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowRoleToggle from "../components/ShowRoleToggle";

const   actorName   = 0,
        actorImg    = 1,
        charID      = 2,
        charName    = 3,
        favorites   = 4,
        charImg     = 5,
        actorID     = 6,
        showID      = 7,
        title       = 8;

export default function Actor() {
    
    const {id, name} = useParams();
    const [actor, setActor] = useState([id || 0, name || "", ""]);
    const [roles, setRoles] = useState([]);
    // console.log(actor)
    const getData = async() => {
        // console.log(actor.actorID)
        const actorData = await fetch ('/actorFull', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: id
          })
        })
        .then(res => res.json());
        for (let i in actorData) {
            actorData[i] = Object.values(actorData[i])
        }
        // console.log(actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg])
        setActor([actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg]]);
        setRoles(actorData)
        // console.log(actorData);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="ActorPage">
            {/* {console.log(actor)} */}
            {actor
                ? <> {combineRoles()}
                <div className="actorRoles">
                    {roles.map((role, n) => 
                        <img src={role[charImg]}></img>
                    )}
                </div>
                <div className="actorInfo">
                    <h1>{actor[1]}</h1>
                    <img className="actorImg" src={actor[2]}></img>
                </div>
                </>
                : <></>
            }
        </div>
    )

    function combineRoles() {
        console.log(roles)
        var currRoleShowIDs = [];
        var currRoleTitles = [];
        // console.log(roles)
        for (let i = 0; i < roles.length; i++) {
            if (typeof roles[i][title] == 'string') {
                currRoleShowIDs = [roles[i][showID]];
                currRoleTitles = [roles[i][title]];
                // var currRoleShowIDs = [roles[i].ShowID];
                // var currRoleTitles = [roles[i].Title];
            }
            else {
                currRoleShowIDs = roles[i][showID];
                currRoleTitles = roles[i][title];
            }
            for (let p = i + 1; p < roles.length; p++) {
                if(roles[i][charID] === roles[p][charID]) {
                    // console.log(currRoleShowIDs)
                    currRoleShowIDs.push(roles[p][showID]);
                    currRoleTitles.push(roles[p][title]);
                    // console.log(currRoleTitles)
                    roles.splice(p, 1);
                    p--;
                }
                else {
                    i = p - 1;
                    break
                }
            }
            roles[i][showID] = currRoleShowIDs;
            roles[i][title] = currRoleTitles;
        }
        console.log(roles)
    }

}