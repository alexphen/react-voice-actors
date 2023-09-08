import { useState, useEffect } from "react";
// import text from '../data/MasterV3.json'
import ShowRoleToggle from "../components/ShowRoleToggle";
import ls from 'local-storage';
// require('dotenv').config();
// console.log('Your environment variable MAL_CLIENT_ID has the value: ', process.env.MAL_CLIENT_ID);
// import dbOperation from "../data/dbFiles/dbOperation"

// const ActorID   = 0;
const ActorName = 1;
// const Favorites = 2;
const ImageURL  = 3;

// export const myList = text;
// const actors = myList.actors;
const topActors = [118, 185, 65, 672, 869, 34785, 212, 2, 270, 591, 99, 11817, 8, 87]
var actorsLeft = [];
resetLeft();
var started = false;

const Home = () => {

    const firstIndex = 0//Math.trunc(Math.random() * topActors.length);
    // const firstActor = actors[topActors[firstIndex]];
    const [actorID, setActorID] = useState(0)//topActors[firstIndex]);
    const loading = [ 0, "Loading", 0, "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="]
    // const loadingRoles = {ActorID: 0, ActorName: "Loading", Favorites: 0, ImageURL: "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="}
    // const [prev, setPrev] = useState();
    const [index, setIndex] = useState(firstIndex);
    const [actor, setActor] = useState(loading);

    console.log("actor", actor)
    console.log("actorID", actorID)

    useEffect(() => {
        // setActor(loading)
        // nextActor();
    }, [])

    // console.log(actor)

    const getData = async(actID) => {
        // console.log(actor.actorID)
        const actorData = await fetch ('/actor', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: actID
          })
        })
        .then(res => res.json());
        setActor(Object.values(actorData[0]));
        // setActorID(actorData[0][ActorID])
        console.log(Object.values(actorData[0]));

        ls.set('actor', actorData[0])
    }

    // const getRoleData = async() => {
    //     const rolesData = await fetch ('/home', {
    //       method: 'POST',
    //       headers: {
    //         'content-type': 'application/json',
    //         'Accept': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         ActorID: actorID
    //       })
    //     })
    //     .then(res => res.json());
    //     setRoles(rolesData);
    //     ls.set('roles', rolesData)
    // }

    // bubbleSort(roles, roles.length);
    // function bubbleSort(roles, n)
    // {
    //     // roleOrder = [];
    //     // for (var r in roles) {
    //     //     roleOrder.push(r)
    //     // }
    //     // console.log("roles", roles)
    //     var i, j, temp;
    //     var swapped;
    //     for (i = 0; i < n - 1; i++) 
    //     {
    //         swapped = false;
    //         for (j = 0; j < n - i - 1; j++) 
    //         {
    //             if (roles[j].Favorites < roles[j + 1].Favorites) 
    //             {
    //                 // Swap arr[j] and arr[j+1]
    //                 temp = roles[j];
    //                 roles[j] = roles[j + 1];
    //                 roles[j + 1] = temp;
    //                 swapped = true;
    //             }
    //         }
    //         // IF no two elements were 
    //         // swapped by inner loop, then break
    //         if (swapped === false)
    //         break;
    //     }
    // }

    function nextActor() {
        // setActor(loading)
        started = true;
        let temp = 0;
        setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
        if (actorsLeft.length > 0) {
            temp = actorsLeft.splice(index, 1)[0]
            console.log("temp", temp)
            setActorID(temp);
        }
        else {
            resetLeft();
            setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
            nextActor();
        }
        getData(temp);
        // getRoleData();
    }
    


    return ( 
        <div className="home">            
            <div>
                <h2>A tool to display all the works of the voice actors you might know!</h2>
                <br></br>
                <h5>Seiyu is a Japanese word for voice actor</h5>
                <br></br>
                <h6>All data obtained from <a href="http://MyAnimeList.net">MyAnimeList.net</a></h6>
                <button className="firstActor" onClick={runAPI}>api test</button>
            </div>
            <div className="viewer">
                {/* {console.log("actorID ", actorID)} */}
                {/* {combineRoles()} */}
                {started
                    ?<><ShowRoleToggle id="topActor" actorID={actorID} actorName={actor[ActorName]}/>
                        <div id="homeRightPane">
                            <img className="homeActorImg" src={actor[ImageURL]} alt={actor[ActorName]}></img>
                            <button className="nextActor" onClick={nextActor}>View Another!</button>
                        </div></>
                    :<button className="firstActor" onClick={nextActor}>Take a Look!</button>
                }
                {/* {console.log("img ", actor.img)} */}
            </div>
            {/* <RoleList roles={roles} actor={actor}/> */}
            {/* <ActorList actors={myList.actors}/> */}
            {/* <ShowsList shows={myList.shows}/> */}
            {/* <ShowInfo show={myList.shows[0]} /> */}
        </div>
     );

     async function runAPI() {
        var url = 'https://api.jikan.moe/v4/anime/1/characters'
        var trying = true
        var attempts = 0
        while (trying) {
            try {
                console.log("vaParse, fetching ")
                const response = await fetch(url, {
                    mode: 'cors',
                    headers:{
                        'X-MAL-CLIENT-ID': '5dbcd29b3178e6d62ec7ecf17b4daf56',
                        'Access-Control-Allow-Origin': '*'
                    }})
                var anime = await response.json()
                response.close()
            } catch (e) {
                // print("Exception at gui.vaParse")
                if (attempts == 20 ) {
                    anime = {}
                    trying = false
                }
                else {
                    sleep(100)
                }
                attempts+= 1
            }
        }
     }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetLeft() {
    for(let i = 0; i < topActors.length; i++) {
        actorsLeft[i] = topActors[i];
    }
}    
 
export default Home;