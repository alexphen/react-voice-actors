import ShowInfo from "../components/ShowInfo"
// import {myList} from './Home'
// import SearchBar from "../components/SearchBar"
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { unmountComponentAtNode } from "react-dom";
const   ShowID      = 0,
        Title       = 1,
        ImageURL    = 2;


export default function Show({user, myList}) {
    
    // const CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'
    const { id, title } = useParams();
    const [keyword, setKeyword] = useState('');
    const [shows, setShows] = useState([]);
    const [titles, setTitles] = useState([]);
    const [showSelected, setShowSelected] = useState([id || 0, title || '']);
    var filterFlag = user.length > 0;
    console.log(user, "in Show")
    // const [showActors, setShowActors] = useState([]);
    
    // useEffect(() => {
    // }, [showSelected])

    useEffect(() => {
        setShowSelected([id, title]);
        setKeyword("");
        getSearchData("");
    }, [id, title])
    
    const getSearchData = async(keyword) => {
        setKeyword(keyword);
        setTitles([])
        if(keyword === "") {
            setTitles([])
        }
        else {
            var idRes = [];
            var tRes = [];

            const searchData = await fetch ('/search', {
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
                tRes.push(searchData[i][Title]);
                idRes.push(searchData[i][ShowID]);
            }
            setTitles(tRes);
            setShows(idRes);
        }
    }

    // const getShowActors = async() => {
    //     const showData = await fetch ('/show', {
    //       method: 'POST',
    //       headers: {
    //         'content-type': 'application/json',
    //         'Accept': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         ShowID: showSelected[0]
    //       })
    //     })
    //     .then(res => res.json());
    //     // console.log(showData)
    //     for (let i in showData) {
    //         showData[i] = Object.values(showData[i])
    //     }
    //     setShowActors(showData);
    // }
    // const updateKeyword = async(keyword) => {

    //     // const results = myList.titles.filter((entry) => {
    //     // // const results = myList.shows.filter((entry) => {
    //     //     // console.log(entry.toLowerCase().match(keyword.toLowerCase()));
    //     //     return entry.toLowerCase().match(keyword.toLowerCase());
    //     // });
    //     // setKeyword(keyword);
    //     // setTitles([])
    //     // if(keyword === "") {
    //     //     setTitles([])
    //     // }
    //     // else {
    //     //     var idRes = [];
    //     //     var tRes = [];
    //     //     getSearchData();
    //     //     console.log("RD", returnedData)
    //     //     for (let i in returnedData) {
    //     //         tRes.push(returnedData[i].Title);
    //     //         idRes.push(returnedData[i].ShowID);
    //     //     }
    //     //     setTitles(tRes);
    //     //     setShows(idRes);
    //     // }
    //     // console.log(titles)
    // }

    // function changeShow(index) {
    //     setKeyword("");
    //     getSearchData("");
    //     setShowSelected([shows[index], titles[index]]);
    //     console.log(showSelected)
    //     getShowActors();
    //     // if (document.getElementById("currList"))
    //     //     document.getElementById("currList").remove()
    //     // console.log("showSelected", showSelected)
    // }


    return (   
        <div className="show">
            {/* {console.log(myList.shows)} */}
            {/* <SearchBar keyword={keyword} onChange={updateKeyword} /> */}
            <div className="header">
                {showSelected[0] != 0
                    ? <h1> {showSelected[Title]} </h1>
                    : <></>
                }
                <div className="searchSide">
                    <input
                        id="Search"
                        type="search"
                        placeholder="Search Show"
                        autoComplete="off"
                        onChange={(e) => getSearchData(e.target.value)}
                        value={keyword} />
                    <div className="results">
                        {/* Display 10 filtered results. Change Show on click */}
                        {titles.slice(0,10).map((title, index) => (
                            <Link to={`/Show/${shows[index]}/${title}`} className="resBox">{title}</Link>
                        ))}
                    </div>
                    {/* <button onClick={() => fetchList("RufusPeanut")}>Fetch List</button> */}
                </div>
            </div>
            {/* {console.log("showSelected", showSelected)} */}
            {showSelected[0] != 0 && showSelected[0] != null //!= 0//.length > 1 //
                ? <> {console.log(showSelected)}
                  <ShowInfo Show={showSelected} user={user} myList={myList} flag={filterFlag}/>
                  {console.log("created showe info")}  </>
                : <h2 id="showHeader">Search for a Show in Your List to Begin!</h2>
            }
            
            {/* <ShowInfo list={myList} show={myList.shows[51535]} /> */}
        </div>     
        // <ShowInfo show={myList.shows[160]} />
        // <ShowInfo show={myList.shows[146]} />

    )
}
// function setShowFromLabel() {
//     setShowSelected([id, title]);
// }


// module.exports = {
//     setShowFromLabel
// }
