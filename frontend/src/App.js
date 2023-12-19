import Navbar from "./components/Navbar";
import Show from "./pages/Show";
import Home from "./pages/Home";
import Actor from "./pages/Actor";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { Route, Routes, useFetcher } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";


function App() {
	const [cookies, setCookies] = useCookies(["acc", "list"])
	const [entry, setEntry]  	= useState(cookies.acc || "");
	const [myList, setMyList] 	= useState(cookies.list || []);
  	const [user, setUser]     	= useState(cookies.acc || "");
	

	// useEffect(() => {
	// 	setDBList();
	// }, [myList])

	// useEffect(() => {
	// 	getMALData()
	// }, [])


	const getMALData = async() => {
		if (entry != "") {
			console.log("getting MAL data")
			try {
				const malData = await fetch ('/api/mal', {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						Username: entry
					})
				})
				.then(res => res.json());
				if (malData == false) {
					console.log("private")
					alert("Your List is marked as private. Please make it public to use this feature.")
				}
				else {

				// instead of array we're turning the list into a comma separated string
					// let temp = [];
					// for (let i in malData.data) {
					// 	temp[i] = malData.data[i].node.id;
					// }
					let str = "("
					for (let i in malData.data) {
						str += malData.data[i].node.id + ","
					}
					str = str.slice(0, str.length - 1) + ")"
					// console.log(str)
					setMyList(str)
					if (str.length > 0) {
						setUser(entry)
						setCookies('acc', entry, {path: '/'})
						setCookies('list', str, {path: '/'})
					}
				}
			} catch (error) {
				console.log(error)
			}
		}
	}


	function userFilter() {
		getMALData()
	}

	// const setDBList = async() => {
	// 	if (myList.length > 0) {
	// 		const myListString = await fetch('/api/list', {
	// 			method: 'POST',
	// 			headers: {
	// 			'content-type': 'application/json',
	// 			'Accept': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				ids: myList
	// 			})
	// 		})
	// 	}
	// }

	return (
		<div className="app">
			{console.log(cookies)}
			
			{/* <Navbar username={user}>
				<h1>Hello</h1>
			
			</Navbar> */}
			<nav className="nav">
            <div id='navLeftPane'>
                <Link to="/" className="site-title">Home</Link>
            </div>
			<div id="userSearchArea">
					<div id="userSearchInputs">
						<input id="userSearch"
							type="text"
							placeholder="MAL Username" 
							value={entry} 
							onChange={(e) => setEntry(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e)}></input>
						<button id="userSearchButton" onClick={userFilter}>Filter by User</button>
					</div>
				<div id='filterLabel'>
					<h6 id='filter'>Filtered by {user.length > 0 ? user : "All Anime"}</h6>
					{user != ""
						? <button id='unfilter' onClick={removeFilter}>Remove Filter</button>
						: <></>
					}
				</div>
			</div>
            <ul id="navPages">
                <CustomLink to="/Anime/">Anime Search</CustomLink>
                <CustomLink to="/Actor/">Actor Search</CustomLink>
            </ul>
        	</nav>
			<Routes>
				<Route path="/Anime/:id?/:title?" element={<Show user={user} myList={myList}/>} />
				<Route path="/Actor/:id?" element={<Actor user={user} myList={myList}/>} />
				<Route path="/" element={<Home user={user} myList={myList}/>} />
			</Routes>
			{/* <button onClick={getData}>Click</button> */}
		</div>
	
	);

	function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: false })
        
        return (
            <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
            </li>
        )
    }

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			userFilter();
		}
	}

	function removeFilter() {
		setUser("")
		setMyList([])
		setEntry("")
		setCookies('acc', "", {path: '/'})
	}
}
export default App

  
  
  





// }

// export default App;
