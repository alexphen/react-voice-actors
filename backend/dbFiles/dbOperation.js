// const config        = require('./dbConfig'),
//       sql           = require('oracledb');


// const getAnime = async(showid) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         let res = pool.execute(`SELECT * FROM Anime WHERE Anime.ShowID='${showid}'`);
//         // let res = pool.execute(`SELECT * FROM Anime`);
//         // console.log(res);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }
// const addAnime = async(Anime) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         let anime = pool.execute(`INSERT INTO Anime VALUES
//         (${Anime.ShowID}, '${Anime.Title}', '${Anime.ImageURL}')`);
//         // console.log(anime);
//         return anime;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }
// const getActor = async(actID) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         // let res = pool.execute(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
//         let res = await pool.execute(`SELECT * FROM Actors WHERE Actors.ActorID='${actID}'`);
//         // console.log(res);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }
// const addActor = async(Actor) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         let actor = pool.execute(`INSERT INTO Actors VALUES
//         (${Actor.ActorID}, '${Actor.ActorName}', ${Actor.Favorites}, '${Actor.ImageURL}')`);
//         // console.log(actor);
//         return actor;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }

// //  ROLES
// const getRoles = async(actID) => {
//     let pool;
//     try {        
//         pool = await sql.getConnection(config);
//         let res = pool.execute(`SELECT Roles.*, Actors.ActorName, Anime.Title FROM Roles
//                                         INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
//                                         INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
//                                         WHERE Roles.ActorID=${actID}`);    //    'CharID' is Roles.CHARID, 'Character' is Roles.CHARACTER, 'Favorites' is Roles.FAVORITES, 'ImageURL' is Roles.IMGURL, 'ActorID' is Roles.ACTORID, 'ShowID' is Roles.SHOWID, 'ActorName' is Actors.ACTORNAME, 'Title' is Anime.Title)
//         // console.log(res);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }

// const getHomeData = async(actID) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         let res = pool.execute(`SELECT Roles.*, Actors.ActorName, Actors.ImageURL, Anime.Title FROM Roles
//                                         INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
//                                         INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
//                                         WHERE Roles.ActorID=${actID}`);
//         console.log(res);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }

// const getSearchData = async(title) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         let res = pool.execute(`SELECT * FROM Anime WHERE UPPER(Anime.Title) LIKE UPPER('%${title}%')`);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             }catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }

// const getShowActors = async(showID) => {
//     let pool;
//     try {
//         pool = await sql.getConnection(config);
//         // let res = pool.execute(`SELECT Roles.* FROM Roles
//         //                                 WHERE Roles.ShowID=${showID}`);
//         let res = pool.execute(`SELECT Roles.Character, Roles.Favorites, Roles.ActorID, Actors.ActorName FROM Roles
//                                         INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
//                                         WHERE Roles.ShowID=${showID}
//                                         AND Roles.Character IN (SELECT MAX(Roles.Character)
//                                                                 FROM Roles
//                                                                 WHERE ShowID=${showID}
//                                                                 GROUP BY ActorID)`);
//         // let res = pool.execute(`SELECT DISTINCT Roles.ActorID, Actors.ActorName FROM Roles
//         //                                 INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
//         //                                 WHERE Roles.ShowID=${showID}`);
//         // console.log(res)
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
//     finally {
//         if (pool){
//             try {
//                 await pool.close();
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// }

// // const getMAL = async(Username) => {
// //     try {        
// //         let pool = await sql.getConnection(config);
// //         let res = pool.execute()
// //         console.log(res);
// //         return res;
// //     }
// //     catch(error) {
// //         console.log(error);
// //     }
// // }

// module.exports = {
//     addActor,
//     addAnime,
//     getActor,
//     getAnime,
//     getHomeData,
//     // getMAL,
//     getSearchData,
//     getShowActors,
//     getRoles
// }








const   {poolPromise}          = require('./dbConfig'),
        MAL                             = require('myanimelist-api-wrapper'),
        sql                             = require('mssql');


const getAnime = async(title) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        // let res = pool.request().query(`SELECT * FROM Anime`);
        console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const addAnime = async(Anime) => {
    try {  
        let pool = await poolPromise;
        let anime = pool.request().query(`INSERT INTO Anime VALUES
        (${Anime.ShowID}, '${Anime.Title}', '${Anime.ImageURL}')`);
        // console.log(anime);
        return anime;
    }
    catch(error) {
        console.log(error);
    }
}
const getActor = async(actID) => {
    try {        
        let pool = await poolPromise;
        // let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        let res = await pool.request().query(`SELECT * FROM Actors WHERE Actors.ActorID='${actID}'`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const getActorFull = async(actID, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = await pool.request().query(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                    INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                    INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                    INNER JOIN MyList ON MyList.ListShowID=Anime.ShowID
                                                    WHERE Actors.ActorID='${actID}'`);
            return res;
        }
        else{
            let res = await pool.request().query(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                WHERE Actors.ActorID='${actID}'`);
            return res;
        }
        // console.log(res);
    }
    catch(error) {
        console.log(error);
    }
}
const addActor = async(Actor) => {
    try {        
        let pool = await poolPromise;
        let actor = pool.request().query(`INSERT INTO Actors VALUES
        (${Actor.ActorID}, '${Actor.ActorName}', ${Actor.Favorites}, '${Actor.ImageURL}')`);
        // console.log(actor);
        return actor;
    }
    catch(error) {
        console.log(error);
    }
}

//  ROLES
const getRoles = async(actID, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
                                            WHERE Roles.ActorID=${actID}
                                            ORDER BY Roles.CharID`);
            // console.log(res);
            return res;
        }
        else {
            let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
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
    }
}

const getHomeData = async(actID) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Actors.ImageURL, Anime.Title FROM Roles
                                        INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                        INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                        WHERE Roles.ActorID=${actID}`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}

const getSearchData = async(title, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = pool.request().query(`SELECT * FROM Anime 
                                            INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
                                            WHERE Anime.Title LIKE '%${title}%'
                                            ORDER By Anime.Popularity`);
            return res;
        } else {
            let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'
                                            ORDER By Anime.Popularity`);
            return res;
        }

    }
    catch(error) {
        console.log(error);
    }
}

const getSearchActorData = async(name) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT * FROM Actors WHERE Actors.ActorName LIKE '%${name}%'
                                        ORDER BY Actors.aFavs DESC`);
        return res;

        // if (flag) {
        //     let res = pool.request().query(`SELECT * FROM Actors 
        //                                     INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
        //                                     WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // } else {
        //     let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // }

    }
    catch(error) {
        console.log(error);
    }
}

const getShowActors = async(showID, flag) => {
    try {        
        let pool = await poolPromise;
        // let res = pool.request().query(`SELECT Roles.* FROM Roles
        //                                 WHERE Roles.ShowID=${showID}`);

        let res = pool.request().query(`SELECT Roles.CharName, Roles.Favorites, Roles.ActorID, Actors.ActorName FROM Roles
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
    }
}

const setList = async(ids) => {
    let pool = await poolPromise;
    try {
        pool.request().query(`TRUNCATE TABLE MyList`);
        for(let i in ids) {
            let res2 = pool.request().query(`INSERT INTO MyList(ListShowID)
                                            VALUES (${ids[i]})`)
        }                   
        return true;                                                  
    } catch (error) {
        console.log(error)
        return false;
    }
}

const getMAL = async(Username) => {
    const anime = MAL().anime;
    const list = MAL().user_animelist;
    var res;
        
    try {
        res = list({
            client_id: '5dbcd29b3178e6d62ec7ecf17b4daf56',
            user_name: Username,
            limit: 1000
        }).get_animelist()()
        // .then((data) => console.log(data))
        return res
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
    getHomeData,
    getMAL,
    getSearchActorData,
    getSearchData,
    getShowActors,
    getRoles,
    setList
}