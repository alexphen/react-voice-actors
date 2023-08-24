import { useEffect, useState } from "react";
import ShowRoleToggle from "./ShowRoleToggle";

const ShowInfo = ({show}) => {

    const actors = [show.actors][0];
    var primary = 0;
    // const [primary, setPrimary] = useState(0);s
    
    var primaryFavs = 0;
    // console.log(actors)
    for (let i in actors) {
        console.log(i);
        let currActor = actors[i];
        for (let k in currActor.roles) {
            if (currActor.roles[k].show == show.title) {
                // console.log("check 1");
                if (currActor.roles[k].fav > primaryFavs) {
                    // console.log(currActor.roles[k])
                    primaryFavs = currActor.roles[k].fav;
                    primary = k;
                    // console.log(primary)
                    // console.log(k);
                }
            }
        }
    }

    return (  
        
        <>
            {/* { function getPrimary() {
                    for (let i in actors) {
                        let currActor = actors[i];
                        for (let k in currActor.roles) {
                            if (currActor.roles[k].show == show.title) {
                                // console.log("check 1");
                                if (currActor.roles[k].fav > primaryFavs) {
                                    // console.log(currActor.roles[k])
                                    primaryFavs = currActor.roles[k].fav;
                                    setPrimary(primary)
                                    // console.log(primary)
                                    console.log(k);
                                }
                            }
                        }
                    }
                    return primary;
                }
            } */}

            <h1 className="showTitle">{show.title}</h1>
            <div className="showInfo">
                {actors.map((actor) => 
                    <div key={actor.actorID}>
                        {/* {console.log(primary)} */}
                        <ShowRoleToggle actor={actor} primary={primary}/>
                    </div>
                )}
            </div>
        </>
    );
}
 
export default ShowInfo;