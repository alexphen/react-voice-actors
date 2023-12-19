import { useState, useEffect } from "react";
import ShowRoleToggle from "../components/ShowRoleToggle";
import ls from 'local-storage';

// const ActorID   = 0;
const ActorName = 1;
// const Favorites = 2;
const ImageURL  = 3;

// export const myList = text;
// const actors = myList.actors;
//const topActors = [118, 185, 65, 672, 869, 34785, 212, 2, 270, 591, 99, 11817, 8, 87]
// var actorsLeft = [];
var started = false;
var cache;

const Home = ({user, myList}) => {
    
    // var firstIndex;
    // started ? firstIndex = Math.trunc(Math.random() * topActors.length)
    //         : firstIndex = 0;

    // const firstActor = actors[topActors[firstIndex]];
    // const [prev, setPrev] = useState();
    const [index, setIndex] = useState(0);//firstIndex);
    const [topActors, setTopActors] = useState([]);
    const [actor, setActor] = useState([]);
    const [actorID, setActorID] = useState(0)//topActors[firstIndex]);
    var filterFlag = user.length > 0;
    // console.log("topActors", topActors)


    useEffect(() => {
        // getHomeActors();
        started = false;
        cache = {};
    }, [])

    useEffect(() => {
        setIndex(0);
        // console.log('index', index)
        started = false;
        getHomeActors()
        // resetIndex();
        if (started) {
            nextActor(0)
        }
    }, [myList])



    // useEffect(() => {
    //     getData()
    // }, [topActors])

    const getHomeActors = async() => {
        const actorData = await fetch('/api/homeActor', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
            //   ActorID: actID
                flag: filterFlag,
                myList: myList
            })
          })
          .then(res => res.json());
          let temp = [];
          for (let i in actorData) {
            temp[i] = actorData[i][0]
          }
          setTopActors(temp)
        //   console.log(temp)
    }

    const getData = async(actID) => {
        // console.log('actID', actID)
        const actorData = await fetch('/api/actor', {
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
        // console.log("actorData", actorData)
        setActor(Object.values(actorData[0]));
        // setActorID(actorData[0][ActorID])
        // console.log(Object.values(actorData[0]));

        ls.set('actor', actorData[0])
    }

    function start() {
        getHomeActors();
        nextActor(index);
    }

    function nextActor(pos) {
        // setActor(loading)
        started = true;
        let temp;
        // console.log("index", index, 'pos', pos)
        // setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
        if (pos < topActors.length) {
            setIndex(pos + 1);
            temp = topActors[pos];
        }
        else {
            setIndex(1);
            temp = topActors[0];
            // temp = actorsLeft.splice(index, 1)[0];
            // resetLeft();
            // setIndex(Math.trunc(Math.random() * actorsLeft.length - 1));
        }
        setActorID(temp);
        // console.log(topActors)
        // console.log('index', index, 'temp', temp)
        getData(temp);
        // getRoleData();
    }


    return ( 
        <div className="home">            
            <div className="homeInfo">
                <h1 id="homeTitle">Who Seiyu?</h1>
                <h2>A tool to display all the works of the voice actors you might know!</h2>
                <br></br>
                <h5>(Seiyu is a Japanese word for voice actor)</h5>
                <br></br>
                <h6>All data obtained from <a href="http://MyAnimeList.net" target="_blank" rel="noreferrer">MyAnimeList.net</a></h6>
                <div className="tips">
                    Tips: <br /> <pre>      To use the site to the fullest, enter your MyAnimeList username above and click "Filter by User" <br></br>      You may navigate the website</pre>
                </div>
               
            </div>
            <div className="viewer">
                {/* {combineRoles()} */}
                {started //actor[0] !== 0
                    ?<><ShowRoleToggle  
                                id="topActor" 
                                actorID={actorID} 
                                actorName={actor[ActorName]} 
                                flag={filterFlag} user={user} 
                                myList={myList}
                                cache={cache}/>
                        <div id="homeRightPane">
                            <img className="homeActorImg" src={actor[ImageURL]} alt={actor[ActorName]}></img>
                            <button className="nextActor" onClick={() => nextActor(index)}>View Another!</button>
                        </div></>
                    :<button className="firstActor" onClick={start}>Take a Look!</button>
                }
                {/* {console.log("img ", actor.img)} */}
            </div>
        </div>
     );
}
 
export default Home;