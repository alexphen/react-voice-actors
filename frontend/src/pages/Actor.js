import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShowRoleToggle from "../components/ShowRoleToggle";

const   actorName   = 0,
        actorImg    = 1,
        charID      = 2,
        charName    = 3,
        favorites   = 4,
        charImg     = 5,
        actorID     = 6,
        showID      = 7,
        title       = 8,
        aFavs       = 9;

export default function Actor({user}) {
    
    const {id, name} = useParams();
    const [actor, setActor] = useState([id || 0, name || "", "", 0]);
    const [roles, setRoles] = useState([]);
    const [names, setNames] = useState([]);
    const [ids, setIds]     = useState([]);
    const [keyword, setKeyword] = useState('');
    var filterFlag = user.length > 0;
    // console.log(actor)


    const getData = async() => {
        // console.log(actor.actorID)
        const actorData = await fetch ('/api/actorFull', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: id,
            flag: filterFlag
          })
        })
        .then(res => res.json());
        for (let i in actorData) {
            actorData[i] = Object.values(actorData[i])
        }
        // console.log(actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg])
        setActor([actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg], actorData[0][aFavs]]);
        setRoles(actorData)
        // console.log(actorData);
    }

    const getSearchData = async(keyword) => {
        setKeyword(keyword);
        setNames([])
        if(keyword === "") {
            setNames([])
        }
        else {
            var idRes = [];
            var nRes = [];

            const searchData = await fetch ('/api/searchActor', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  Title: keyword,
                  flag: filterFlag
                })
            })
            .then(res => res.json());
            console.log("SD", searchData)

            // console.log("RD", returnedData)
            for (let i in searchData) {
                searchData[i] = Object.values(searchData[i]);
                if (searchData[i][0] > 0) {
                    nRes.push(searchData[i][1]);
                    idRes.push(searchData[i][0]);
                }
            }
            setNames(nRes);
            setIds(idRes);
            // console.log(nRes)
            // console.log(idRes)
        }
    }

    useEffect(() => {
        if (id > 0)
            getData();
    }, [])

    useEffect(() => {
        if (id > 0) {
            setKeyword("")
            getSearchData("")
            getData();
        }
    }, [id])

    return (
        <div className="actorPage">
            {actor[0] > 0
                ? <> {combineRoles()} {bubbleSort()} {console.log(actor)}
                <div className="actorRoles">
                    {roles.map((role, n) => 
                        <div className="actorRole">
                            <img src={role[charImg]}></img>
                            <div className="info">
                                <h3>{role[charName] + " (" + role[favorites] + " Favorites)"}</h3>
                                {role[title].map((title, n) =>
                                    <div key={n}>
                                        <Link to={`/Show/${role[showID][n]}/${title}`}>{title}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div id="actorRightPane">
                    <div className="searchSide">
                        <input
                            id="Search"
                            type="search"
                            placeholder="Search Actor"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {console.log(names)}
                            {names.slice(0,10).map((name, index) => (
                                <Link to={`/Actor/${ids[index]}/`} className="resBox">{name}</Link>
                            ))}
                        </div>
                        {/* <button onClick={() => fetchList("RufusPeanut")}>Fetch List</button> */}
                    </div>
                    <div className="actorInfo">
                        <h1>{actor[1]}</h1>
                        <img className="actorImg" src={actor[2]}></img>
                        <p>Favorites: {actor[3]}</p>
                    </div>
                </div>
                </>
                : <><div id="actorRightPane">
                    <div className="searchSide">
                        <input
                            id="Search"
                            type="search"
                            placeholder="Search Actor"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {console.log(names)}
                            {names.slice(0,10).map((name, index) => (
                                <Link to={`/Actor/${ids[index]}/`} className="resBox">{name}</Link>
                            ))}
                        </div>
                        {/* <button onClick={() => fetchList("RufusPeanut")}>Fetch List</button> */}
                    </div>
                </div>
                </>
            }
        </div>
    )

    function combineRoles() {
        // console.log(roles)
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
        // console.log(roles)
    }

    function bubbleSort()
    {
        // roleOrder = [];
        // for (var i in roles) {
        //     roleOrder.push(i)
        // }
        var i, j, temp;
        var n = roles.length;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (roles[j][favorites] < roles[j + 1][favorites]) 
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


}