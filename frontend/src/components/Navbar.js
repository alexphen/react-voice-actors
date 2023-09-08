import * as React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"

const Navbar = () => {

    return (
        <nav className="nav">
        <Link to="/" className="site-title">
            MyAnimeList Voice Actors
        </Link>
        <ul>
            <CustomLink to="/Show/0/0">Show Search</CustomLink>
            <CustomLink to="/Actor/0/0">Actor Search</CustomLink>
        </ul>
        </nav>
    )
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