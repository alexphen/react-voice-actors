import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import text from '../data/MasterV3.json'
import ShowRoleToggle from "../components/ShowRoleToggle";
import ls from 'local-storage';
import axios from "axios";
// import { getMAL } from "../../../backend/dbFiles/dbOperation";
// require('dotenv').config();
// console.log('Your environment variable MAL_CLIENT_ID has the value: ', process.env.MAL_CLIENT_ID);
// import dbOperation from "../data/dbFiles/dbOperation"
// import {user, myList} from Navbar

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

const Home = ({user, myList}) => {
    
    var firstIndex;
    started ? firstIndex = Math.trunc(Math.random() * topActors.length)
            : firstIndex = 0;
    // const firstActor = actors[topActors[firstIndex]];
    const [actorID, setActorID] = useState(0)//topActors[firstIndex]);
    const loading = [ 0, "Loading", 0, "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="]
    // const loadingRoles = {ActorID: 0, ActorName: "Loading", Favorites: 0, ImageURL: "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="}
    // const [prev, setPrev] = useState();
    const [index, setIndex] = useState(firstIndex);
    const [actor, setActor] = useState(loading);
    var filterFlag = user.length > 0;
    // const {loadedID} = useParams();
    // console.log(actor)

    // console.log("actor", actor)
    // console.log("actorID", actorID)



    useEffect(() => {
        started = false;
    }, [])

    // useEffect(() => {

    // }, [user])

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
        // console.log(Object.values(actorData[0]));

        ls.set('actor', actorData[0])
    }

    // const getMALData = async() => {
    //     console.log("getting MAL data")
    //     const malData = await fetch ('/mal', {
    //       method: 'POST',
    //       headers: {
    //         'content-type': 'application/json',
    //         'Accept': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         Username: user
    //       })
    //     })
    //     .then(res => res.json());
    //     let temp = [];
    //     console.log(malData.data[0].node)
    //     for (let i in malData.data) {
    //         temp[i] = malData.data[i].node.id;
    //     }
    //     setMyList(temp)
    // }


    function nextActor() {
        // setActor(loading)
        started = true;
        let temp = 0;
        setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
        if (actorsLeft.length > 0) {
            temp = actorsLeft.splice(index, 1)[0]
            // console.log("temp", temp)
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
                {/* <p>{user}</p> */}
               
            </div>
            <div className="viewer">
                {/* {console.log("actorID ", actorID)} */}
                {/* {combineRoles()} */}
                {actor[0] !== 0
                    ?<><ShowRoleToggle id="topActor" actorID={actorID} actorName={actor[ActorName]} flag={filterFlag} user={user} myList={myList}/>
                        <div id="homeRightPane">
                            <img className="homeActorImg" src={actor[ImageURL]} alt={actor[ActorName]}></img>
                            <button className="nextActor" onClick={nextActor}>View Another!</button>
                        </div></>
                    :<button className="firstActor" onClick={nextActor}>Take a Look!</button>
                }
                {/* {console.log("img ", actor.img)} */}
            </div>
        </div>
     );
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