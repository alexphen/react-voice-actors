import ShowInfo from "../components/ShowInfo"
// import {myList} from './Home'
// import SearchBar from "../components/SearchBar"
import { useState } from "react";
// import { unmountComponentAtNode } from "react-dom";

export default function Show() {
    
    // const CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'
    
    const [keyword, setKeyword] = useState('');
    const [shows, setShows] = useState([]);
    const [titles, setTitles] = useState([]);
    const [returnedData, setReturnedData] = useState([]);
    const [showSelected, setShowSelected] = useState([]);
    
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
                  Title: keyword
                })
            })
            .then(res => res.json());
            setReturnedData(searchData);
            // console.log("SD", searchData)

            // console.log("RD", returnedData)
            for (let i in searchData) {
                tRes.push(searchData[i].Title);
                idRes.push(searchData[i].ShowID);
            }
            setTitles(tRes);
            setShows(idRes);
        }
    }
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

    const CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56';

    function changeShow(index) {
        setKeyword("");
        getSearchData("");
        setShowSelected([shows[index], titles[index]]);
        console.log("showSelected", showSelected)
    }

    // function fetchList(username) {
    //     var url = 'https://api.myanimelist.net/v2/users/' + username + '/animelist?fields={title,related_anime,id,alternative_titles=en}&limit=1000'
    //     let response = fetch(url, {
    //         headers: {'X-MAL-CLIENT-ID': CLIENT_ID,
    //                   'Access-Control-Allow-Origin': '*',
    //                   "Access-Control-Allow-Methods": "POST, GET, PUT",
    //                   "Access-Control-Allow-Headers": "Content-Type"
    //                 }
    //     })
    //     console.log(response)
    //     // response.raise_for_status()
    // }

    return (   
        <div className="show">
            {/* {console.log(myList.shows)} */}
            {/* <SearchBar keyword={keyword} onChange={updateKeyword} /> */}
            <div className="header">
                {showSelected
                    ? <h1> {showSelected.title} </h1>
                    : <></>
                }
                <div className="searchSide">
                    <input
                        id="Search"
                        type="search"
                        placeholder="Search Show"
                        onChange={(e) => getSearchData(e.target.value)}
                        value={keyword} />
                    <div className="results">
                        {/* Display 10 filtered results. Change Show on click */}
                        {titles.slice(0,10).map((title, index) => (
                            <div className="resBox" key={index} onClick={(e) => changeShow(index)}>
                                    <p>{title}</p>
                            </div>
                        ))}
                    </div>
                    {/* <button onClick={() => fetchList("RufusPeanut")}>Fetch List</button> */}
                </div>
            </div>
            {/* {console.log("showSelected", showSelected)} */}
            {showSelected != 0
                ? <ShowInfo id="currList" Show={showSelected} />
                : <h2 id="showHeader">Search for a Show in Your List to Begin!</h2>
            }
            
            {/* <ShowInfo list={myList} show={myList.shows[51535]} /> */}
        </div>     
        // <ShowInfo show={myList.shows[160]} />
        // <ShowInfo show={myList.shows[146]} />

    )
}