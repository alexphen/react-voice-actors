import Navbar from "./components/Navbar"
import Show from "./pages/Show"
import Home from "./pages/Home"
import Actor from "./pages/Actor"
import { Route, Routes } from "react-router-dom"
import { useState } from "react"


function App() {

  const [returnedData, setDataReturned] = useState(['']);
  const [anime, setAnime] = useState({ShowID: 0, Title: "", ImageURL: ""});
  const [actor, setActor] = useState({ActorID: 0, ActorName: "", Favorites: 0, ImageURL: ""});

  const setInput = (e) => {
    const {name, value} = e.target;
    console.log(value);
  }

  const getData = async () => {
    const newData = await fetch ('/api', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: anime.Title
      })
    })
    .then(res => res.json());
    console.log(newData);
    setDataReturned(newData[0])
  }

  const createActor = async () => {
    const newData = await fetch ('/hello', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...actor
      })
    })
    .then(res => res.json());
    console.log(newData);
    setDataReturned(newData[0])
  }

  return (
      <>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Show" element={<Show />} />
            <Route path="/Actor" element={<Actor />} />
          </Routes>
        </div>
        {/* <button onClick={getData}>Click</button> */}
      </>
  
  );
}
export default App

  
  
  





// }

// export default App;
