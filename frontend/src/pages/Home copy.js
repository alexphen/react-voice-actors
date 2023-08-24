import { useState } from "react";
import RoleList from "../components/RoleList";
// import text from '../data/Master4.json' // WILL NEED TO CHANGE TO READ FROM MAL
import text from '../data/MasterV3.json'
import ActorList from "../components/ActorList";
import ShowsList from "../components/ShowsList";
import { bubbleSort } from "../components/ShowInfo";
import ShowRoleToggle from "../components/ShowRoleToggle";
// import dbOperation from "../data/dbFiles/dbOperation"


export const myList = text;
const actors = myList.actors;
const topActors = [118, 185, 65, 672, 869, 34785, 212, 2, 270, 591, 99, 11817, 8, 87]
var actorsLeft = [];
resetLeft();

var started = false;

const Home = () => {

    const firstIndex = Math.trunc(Math.random() * topActors.length);
    const firstActor = actors[topActors[firstIndex]];
    const [actor, setActor] = useState(firstActor);
    const [prev, setPrev] = useState();
    const [index, setIndex] = useState(firstIndex);
    var roleOrder


    bubbleSort(actor.roles, Object.keys(actor.roles).length);
    // console.log(Object.keys(actor.roles).length)
    // console.log(actorsLeft)
    function bubbleSort(roles, n)
    {
        roleOrder = [];
        for (var i in roles) {
            roleOrder.push(i)
        }
        var i, j, temp;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (actor.roles[roleOrder[j]].fav < actor.roles[roleOrder[j + 1]].fav) 
                {
                    // Swap arr[j] and arr[j+1]
                    temp = roleOrder[j];
                    roleOrder[j] = roleOrder[j + 1];
                    roleOrder[j + 1] = temp;
                    swapped = true;
                }
            }
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped == false)
            break;
        }
    }
    // console.log(roleOrder)

    function nextActor() { 
        // ShowRoleToggle.restart();
        if (!started) {
            started = true;
            nextActor();
        }
        setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));


        // var data = dbOperation.getAnime(
        //     `SELECT Actors.*, Roles.CharName, Anime.Title, Anime.ShowID
        //         FROM Actors
        //         INNER JOIN Roles ON Actors.ActorID=Roles.ActorID
        //         INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
        //         WHERE ActorID=${index}`);
        // console.log(data);
        // console.log("index", index)
        // console.log("ID", actorsLeft[index])


        if (actorsLeft.length > 0) {
            // next = actorsLeft.splice(index, 1)
            setActor(actors[actorsLeft.splice(index, 1)[0]]);
        }
        else {
            // setActorsLeft(topActors);
            resetLeft();
            setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
            nextActor();
        }
    }
    

    return ( 
        <div className="home">
            {/* <h1>Home</h1> */}
            {/* {nextActor()} */}
            {/* {console.log(actor)} */}
            
            <div>
                <h2>A tool to display all the works of the voice actors you might know!</h2>
                <br></br>
                <h5>Seiyu is a Japanese word for voice actor</h5>
                <br></br>
                <h6>All data obtained from <a href="http://MyAnimeList.net">MyAnimeList.net</a></h6>
            </div>
            <div className="viewer">
                {/* {console.log("actor ", actor)} */}
                <ShowRoleToggle id="topActor" actor={actor} roleOrder={roleOrder}/>
                {/* {console.log("img ", actor.img)} */}
                <div id="homeRightPane">
                    <img className="homeActorImg" src={actor.img}></img>
                    <button className="nextActor" onClick={nextActor}>View Another!</button>
                </div>
            </div>
            {/* <RoleList roles={roles} actor={actor}/> */}
            {/* <ActorList actors={myList.actors}/> */}
            {/* <ShowsList shows={myList.shows}/> */}
            {/* <ShowInfo show={myList.shows[0]} /> */}
        </div>
     );
}


function resetLeft() {
    for(let i = 0; i < topActors.length; i++) {
        actorsLeft[i] = topActors[i];
    }
}    
 
export default Home;