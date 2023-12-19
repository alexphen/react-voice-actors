import * as React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import {useState, useEffect, useContext} from "react";

const Navbar = ({ username }) => {
    var list = "All Anime";
    const [user, setUser] = useState("");
    const [myList, setMyList]   = useState([]);


    
    // const setDBList = async() => {
    //     const lister = await fetch('/api/list', {
    //         method: 'POST',
    //         headers: {
    //           'content-type': 'application/json',
    //           'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           ids: myList
    //         })
    //       })
    // }


    return (
        <nav className="nav">
            <div id='navLeftPane'>
                <Link to="/" className="site-title">
                    Home
                </Link>
            </div>
            <ul>
                <CustomLink to="/Anime/">Anime Search</CustomLink>
                <CustomLink to="/Actor/">Actor Search</CustomLink>
            </ul>
        </nav>
    )
    
    module.exports = {
        user,
        myList
    }
}
      
    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        
        return (
            <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
            </li>
        )
    }



    // return ( 
    //     <nav className="navbar">
    //         <h1>MyAnimeList Voice Actors</h1>
    //         <ul className="links">
    //             <a href="/">Home</a>
    //             {/* <a onClick={openSearch}>Show Search</a> */}
    //             <a href="/Show">Show Search</a>
    //             <a href="/Actor">Actor Search</a>
    //         </ul>
    //     </nav>
    //  );
// }

// const [open, setOpen] = useState(false);

    // function openSearch() {
    //     setOpen(!open);
    // }

    // const [keyword, setKeyword] = useState('');
    // const [shows, setShows] = useState([]);
    // const [titles, setTitles] = useState([]);
    // const [showSelected, setShowSelected] = useState(myList.shows[1]);
    
    // const updateKeyword = (keyword) => {

    //     setKeyword(keyword);
    //     if(keyword === "") {
    //         setTitles([])
    //     }
    //     else {
    //         var results = [];
    //         var tRes = [];
    //         for (var id in myList.shows) {
    //             var curr = myList.shows[id];
    //             if (curr.title.toLowerCase().includes(keyword.toLowerCase())) {
    //                 results.push(curr)
    //                 tRes.push(curr.title)
    //             }
    //         }
    //         setTitles(tRes);
    //         setShows(results);
    //     }
    //     // console.log(titles)
    // }
 
export default Navbar;

