import { useState, useEffect } from "react";
// import text from '../data/MasterV3.json'
import ShowRoleToggle from "../components/ShowRoleToggle";
import ls from 'local-storage';
// import dbOperation from "../data/dbFiles/dbOperation"


// export const myList = text;
// const actors = myList.actors;
const topActors = [118, 185, 65, 672, 869, 34785, 212, 2, 270, 591, 99, 11817, 8, 87]
var actorsLeft = [];
resetLeft();

const Home = () => {

    const firstIndex = Math.trunc(Math.random() * topActors.length);
    // const firstActor = actors[topActors[firstIndex]];
    const [actorID, setActorID] = useState(topActors[firstIndex]);
    const loading = {ActorID: 0, ActorName: "Loading", Favorites: 0, ImageURL: "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="}
    const loadingRoles = {ActorID: 0, ActorName: "Loading", Favorites: 0, ImageURL: "https://media.istockphoto.com/id/1360005202/vector/loon-gavia.jpg?s=612x612&w=0&k=20&c=y6ZnKz2hLqGnFjNWuQpxwGCuqT3NYk4vz0MOtEyM3Bc="}
    // const [prev, setPrev] = useState();
    const [index, setIndex] = useState(firstIndex);
    const [actor, setActor] = useState({ActorID: topActors[firstIndex], ActorName: "Loading", Favorites: 0, ImageURL: ""});
    const [roles, setRoles] = useState([]); //useState({CharID: 0, CharName: "", Favorites: 0, ImageURL: "", ActorID: 0, ShowID: 0});
    var roleOrder;

    // componentDidMount() {
    //     fetch(URL)
    //     .then(response => response.json())
    //     .then(json => this.setState({
    //       articles: json.results,
    //       actor: ls.get('actor') || [],
    //       roles: ls.get('roles') || []
    //     }));
    //     this.startInterval();
    // }

    useEffect(() => {
        setActor(loading)
        nextActor();
    }, [])

    // console.log(actor)

    const getData = async() => {
        // console.log(actor.actorID)
        const actorData = await fetch ('/actor', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: actorID
          })
        })
        .then(res => res.json());
        setActor(actorData[0]);
        ls.set('actor', actorData[0])
    }

    const getRoleData = async() => {
        const rolesData = await fetch ('/home', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: actorID
          })
        })
        .then(res => res.json());
        setRoles(rolesData);
        ls.set('roles', rolesData)
    }

    bubbleSort(roles, roles.length);
    function bubbleSort(roles, n)
    {
        // roleOrder = [];
        // for (var r in roles) {
        //     roleOrder.push(r)
        // }
        // console.log("roles", roles)
        var i, j, temp;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (roles[j].Favorites < roles[j + 1].Favorites) 
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

    function nextActor() {
        setActor(loading)
        setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
        if (actorsLeft.length > 0) {
            setActorID(actorsLeft.splice(index, 1)[0]);
        }
        else {
            resetLeft();
            setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
            nextActor();
        }
        getData();
        // getRoleData();
    }
    
    
    function combineRoles() {
        for (let i = 0; i < roles.length - 1; i++) {
            var currRoleShowIDs = [roles[i].ShowID];
            var currRoleTitles = [roles[i].Title];
            roles[i].ShowID = currRoleShowIDs;
            roles[i].Title = currRoleTitles;
            var checking = true;
            // while (checking) {
            for (let p = i + 1; p < roles.length; p++) {
                if(roles[i].CharID === roles[p].CharID) {
                    currRoleShowIDs.push(roles[p].ShowID);
                    currRoleTitles.push(roles[p].Title);
                    roles.splice(p, 1);
                    p--;
                    roles[i].ShowID = currRoleShowIDs;
                    roles[i].Title = currRoleTitles;
                }
                else {
                    i = p - 1;
                    break
                }
            }
        }
    }

    return ( 
        <div className="home">            
            <div>
                <h2>A tool to display all the works of the voice actors you might know!</h2>
                <br></br>
                <h5>Seiyu is a Japanese word for voice actor</h5>
                <br></br>
                <h6>All data obtained from <a href="http://MyAnimeList.net">MyAnimeList.net</a></h6>
            </div>
            <div className="viewer">
                {console.log("actor ", actor)}
                {/* {combineRoles()} */}
                <ShowRoleToggle id="topActor" actorID={actor.ActorID} actorName={actor.ActorName}/>
                {/* {console.log("img ", actor.img)} */}
                <div id="homeRightPane">
                    <img className="homeActorImg" src={actor.ImageURL} alt={actor.ActorName}></img>
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