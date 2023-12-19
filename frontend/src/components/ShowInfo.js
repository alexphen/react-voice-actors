import { useEffect, useState } from "react";
import ShowRoleToggle from "./ShowRoleToggle";
import { useParams } from "react-router-dom";

const   CharName    = 0,
        Favorites   = 1,
        ActorID     = 2,
        ActorName   = 3,
        ImageURL    = 4;

var toggles = [];
var set = false;
var cache = {};

const ShowInfo = ({ user, myList, flag }) => {

    // console.log(Show)

    const {id, Title} = useParams();
    const [showSelected, setShowSelected] = useState([id || 0, Title || ""])
    const [actors, setActors] = useState([]);
    const [count, setCount] = useState([0]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(16);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(true); ///////
    const [keyword, setKeyword] = useState('');
    const [dispActors, setDispActors] = useState([]);
    

    const getShowActors = async() => {
        const showData = await fetch ('/api/show', {
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
        // console.log(showData)
        for (let i in showData) {
            showData[i] = Object.values(showData[i]);
        }
        setActors(showData)
    }

    useEffect(() => {
        setCount(actors.length)
        if (count > perPage) {
            setHasNext(true);
        }
        setDispActors(actors)
    }, [actors])

    useEffect(() => {
        // console.log(id)
        cache = {}
        if (id > 0) {
            setShowSelected([id, Title])
            getShowActors();
            setPage(0);
            set = true;
        }
    }, [id]);


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
        let i = 0;
        while (true) {
            if (i > actors.length - 1) break;
            // console.log(i)
            // console.log(actors[i][ActorID])
            // console.log(actorIDs)
            // console.log(actors)
            if (actorIDs.includes(actors[i][ActorID])) {
                actors.splice(i, 1);
                i--;
            }
            else {
                actorIDs.push(actors[i][ActorID])
            }
            i++;
            // console.log(actors)
        }
        // count = actors.length;
    }

    useEffect(() => {
        // console.log(count, page*perPage)
        if (page == 0)
            setHasPrev(false)
        if ((page+1)*perPage > count)
            setHasNext(false)
    }, [page])

    function prevPage() {
        setPage(page - 1)
        setHasNext(true)
        window.scroll(0, 0);
    }

    function nextPage() {
        if (hasNext) {
            setPage(page + 1)
            setHasPrev(true)
        }
        window.scroll(0, 0);
    }

    function filterBy(arr, query) {
        setKeyword(query);
        console.log(arr)
        setDispActors(arr.filter((el) => el[CharName].toLowerCase().includes(query.toLowerCase())
        || el[ActorName].toLowerCase().includes(query.toLowerCase())));
    }

    return (  
        <>
            <input
                id="filterInput"
                type="search"
                placeholder="Filter by Character/Actor"
                autoComplete="off"
                onChange={(e) => filterBy(actors, e.target.value)}
                value={keyword} />
            {/* {console.log("rendered")} */}
            {/* <h1 className="showTitle">{Title}</h1> */}
            {/* <h1>{page}</h1> */}
            {console.log("cache", cache)}
            <div className="showInfo">
                {removeDups()}
                {bubbleSortActors(actors, actors.length)}
                {actors.length > 0 && set
                    ? dispActors.slice(perPage*page, perPage*page + perPage).map((actor, n) => 
                        // <div >
                            <ShowRoleToggle key={actor[ActorID]}
                                            actorID={actor[ActorID]}
                                            actorName={actor[ActorName]}
                                            actorImg={actor[ImageURL]}
                                            showID={id}
                                            flag={flag}
                                            user={user}
                                            myList={myList}
                                            cache={cache}/>
                        // </div>
                    )
                    
                    : <>
                        <p>Failed to load from API :(</p>  
                      </>
                }
                <button id="prevPage" disabled={!hasPrev} onClick={prevPage}>Prev Page</button>
                <button id="nextPage" disabled={!hasNext} onClick={nextPage}>Next Page</button>
            </div>
        </>
    );
}
 
export default ShowInfo;