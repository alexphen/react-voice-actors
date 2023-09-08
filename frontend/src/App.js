import Navbar from "./components/Navbar"
import Show from "./pages/Show"
import Home from "./pages/Home"
import Actor from "./pages/Actor"
import { Route, Routes } from "react-router-dom"


function App() {

  return (
      <>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Show/:id/:title" element={<Show />} />
            <Route path="/Actor/:id" element={<Actor />} />
          </Routes>
        </div>
        {/* <button onClick={getData}>Click</button> */}
      </>
  
  );
}
export default App

  
  
  





// }

// export default App;
