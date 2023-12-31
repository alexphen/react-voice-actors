const   MAL           = require('myanimelist-api-wrapper'),
        oracledb      = require('oracledb'),
        process       = require("process"),
        env        = require('../dotenv.js');


const getAnime = async(title) => {
    try {        
        connection = await oracledb.getConnection();
        let res = connection.execute(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        // let res = pool.execute(`SELECT * FROM Anime`);
        //console.log(res);
        return res;
    } catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}
const addAnime = async(Anime) => {
    try {  
        connection = await oracledb.getConnection();
        let anime = connection.execute(`INSERT INTO Anime VALUES
        (${Anime.ShowID}, '${Anime.Title}', '${Anime.ImageURL}')`);
        // console.log(anime);
        return anime;
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}
const getHomeActors = async(flag, myList) => {
    let connection;
    let res;
    try {
        connection = await oracledb.getConnection();
        if (flag) {
            res = connection.execute(`SELECT DISTINCT Actors.ActorID FROM Actors
                                        INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                        WHERE Roles.ShowID IN ${myList}
                                        ORDER BY Actors.aFavs DESC
                                        FETCH FIRST 20 ROWS ONLY`)
        }
        else {
            res = connection.execute(`SELECT DISTINCT Actors.ActorID FROM Actors
                                        INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                        ORDER BY Actors.aFavs DESC
                                        FETCH FIRST 20 ROWS ONLY`)
        }
        return res;
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}
const getActor = async(actID) => {
    let connection;
    try {        
        // console.log(actID);
        connection = await oracledb.getConnection();
        // console.log("connected");
        let res = await connection.execute(`SELECT * FROM Actors WHERE Actors.ActorID='${actID}'`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}
const getActorFull = async(actID, myList, flag) => {
    try {        
        connection = await oracledb.getConnection();
        if (flag) {
            let res = await connection.execute(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                    INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                    INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                    WHERE Actors.ActorID='${actID}' 
                                                        AND Anime.ShowID IN ${myList}
                                                    ORDER BY Roles.Favorites DESC, Anime.POPULARITY`);
            return res;
        }
        else{
            let res = await connection.execute(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                WHERE Actors.ActorID='${actID}'
                                                ORDER BY Roles.Favorites DESC, Anime.POPULARITY`);
            return res;
        }
        // console.log(res);
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}
const addActor = async(Actor) => {
    try {        
        connection = await oracledb.getConnection();
        let actor = connection.execute(`INSERT INTO Actors VALUES
        (${Actor.ActorID}, '${Actor.ActorName}', ${Actor.Favorites}, '${Actor.ImageURL}')`);
        // console.log(actor);
        return actor;
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

//  ROLES
const getRoles = async(actID, myList, flag) => {
    try {        
        connection = await oracledb.getConnection();
        if (flag) {
            let res = connection.execute(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            WHERE Roles.ActorID=${actID}
                                                AND Roles.ShowID IN ${myList}
                                            ORDER BY Roles.CharID`);
            
            return res;
        }
        else {
            let res = connection.execute(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            WHERE Roles.ActorID=${actID}
                                            ORDER BY Roles.CharID`);
            // console.log(res);
            return res;
        }
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

const getHomeData = async(flag, myList) => {
    try {        
        connection = await oracledb.getConnection();
        if (flag) {
            let res = connection.execute(`SELECT Roles.*, Actors.ActorName, Actors.ImageURL, Actors.aFavs, Anime.Title FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            WHERE Anime.ShowID IN ${myList}
                                            ORDER BY Actors.aFavs DESC
                                            FETCH FIRST 20 ROWS ONLY`);
            return res;
        } else {
            let res = connection.execute(`SELECT * FROM Actors
                                            ORDER BY Actors.aFavs DESC
                                            FETCH FIRST 20 ROWS ONLY`)
            // let res = connection.execute(`SELECT Roles.*, Actors.ActorName, Actors.ImageURL, Actors.aFavs, Anime.Title FROM Roles
            //                             INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
            //                             INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
            //                             ORDER BY Actors.aFavs
            //                             FETCH FIRST 20 ROWS ONLY`);
            return res;
        }
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

const getSearchData = async(title, myList, flag) => {
    try {        
        connection = await oracledb.getConnection();
        if (flag) {
            let res = connection.execute(`SELECT * FROM Anime
                                            WHERE UPPER(Anime.Title) LIKE UPPER('%${title}%')
                                            AND Anime.ShowID IN ${myList}
                                            ORDER By Anime.Popularity`);
            return res;
        } else {
            let res = connection.execute(`SELECT * FROM Anime WHERE UPPER(Anime.Title) LIKE UPPER('%${title}%')
                                            ORDER By Anime.Popularity`);
            return res;
        }

    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

const getSearchActorData = async(name, myList, flag) => {
    try {        
        connection = await oracledb.getConnection();
        if (flag) {
            let res = connection.execute(`SELECT DISTINCT Actors.* FROM Actors 
                                            INNER JOIN ROLES ON ROLES.ACTORID=Actors.ACTORID                            
                                            WHERE UPPER(Actors.ActorName) LIKE UPPER('%${name}%')
                                            AND Roles.ShowID in ${myList}
                                            ORDER BY Actors.aFavs DESC`);
            return res;
        } else {
            let res = connection.execute(`SELECT Actors.* FROM Actors 
                                            WHERE UPPER(Actors.ActorName) LIKE UPPER('%${name}%')
                                            ORDER BY Actors.aFavs DESC`);
            return res;
        }

        // if (flag) {
        //     let res = pool.execute(`SELECT * FROM Actors 
        //                                     INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
        //                                     WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // } else {
        //     let res = pool.execute(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // }

    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

const getShowActors = async(showID, flag) => {
    try {        
        connection = await oracledb.getConnection();
        // let res = pool.execute(`SELECT Roles.* FROM Roles
        //                                 WHERE Roles.ShowID=${showID}`);

        let res = connection.execute(`SELECT Roles.CharName, Roles.Favorites, Roles.ActorID, Actors.ActorName FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            WHERE Roles.ShowID=${showID}
                                            AND Roles.Favorites IN (SELECT MAX(Roles.Favorites)
                                                                        FROM Roles
                                                                        WHERE ShowID=${showID}
                                                                        GROUP BY ActorID)
                                            ORDER BY Roles.Favorites DESC`);
        return res;
    }
    catch(error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
        }
    }
}

// const setList = async(ids) => {
//     let connection = await oracledb.getConnection();
//     try {
//         let str = "("
//         for (let i in ids) {
//             str += ids[i] + ","
//         }
//         str = str + ") done"
//         // console.log(str)
        
//         // let res = connection.execute(`SELECT * FROM Anime WHERE ShowID IN ${str}`);
//         return str;


//         // connection.execute(`TRUNCATE TABLE MyList`);
//         // for(let i in ids) {
//         //     connection.execute(`INSERT INTO MyList(ListShowID) VALUES (${ids[i]})`);
//         //     connection.commit();
//         // }                   
//         return true;                                                  
//     } catch (error) {
//         console.log(error)
//         return false;
//     } finally {
//         if (connection) {
//           try {
//             await connection.close(); // Put the connection back in the pool
//           } catch (err) {
//               throw (err);
//           }
//         }
//     }
// }

const getMAL = async(Username) => {
    debugger;
    const anime = MAL().anime;
    const list = MAL().user_animelist;
    var res;
    try {
        res = list({
            client_id: env.MAL_CLIENT_ID,
            user_name: Username,
            limit: 1000
        }).get_animelist()()
        // .then((data) => console.log(data))
        return res;
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = {
    addActor,
    addAnime,
    getActor,
    getActorFull,
    getAnime,
    getHomeActors,
    getHomeData,
    getMAL,
    getSearchActorData,
    getSearchData,
    getShowActors,
    getRoles
}