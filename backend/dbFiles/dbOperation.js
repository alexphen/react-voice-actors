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








const config        = require('./dbConfig'),
      sql           = require('mssql');


const getAnime = async(title) => {
    try {        
        let pool = await sql.connect(config);
        let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        // let res = pool.request().query(`SELECT * FROM Anime`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const addAnime = async(Anime) => {
    try {        
        let pool = await sql.connect(config);
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
        let pool = await sql.connect(config);
        // let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        let res = await pool.request().query(`SELECT * FROM Actors WHERE Actors.ActorID='${actID}'`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const getActorFull = async(actID) => {
    try {        
        let pool = await sql.connect(config);
        let res = await pool.request().query(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title FROM Actors
                                                INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                WHERE Actors.ActorID='${actID}'`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const addActor = async(Actor) => {
    try {        
        let pool = await sql.connect(config);
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
const getRoles = async(actID) => {
    try {        
        let pool = await sql.connect(config);
        let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Anime.Title FROM Roles
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

const getHomeData = async(actID) => {
    try {        
        let pool = await sql.connect(config);
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

const getSearchData = async(title) => {
    try {        
        let pool = await sql.connect(config);
        let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'`);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}

const getShowActors = async(showID) => {
    try {        
        let pool = await sql.connect(config);
        // let res = pool.request().query(`SELECT Roles.* FROM Roles
        //                                 WHERE Roles.ShowID=${showID}`);
        let res = pool.request().query(`SELECT Roles.CharName, Roles.Favorites, Roles.ActorID, Actors.ActorName FROM Roles
                                        INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                        WHERE Roles.ShowID=${showID}
                                        AND Roles.CharName IN (SELECT MAX(Roles.CharName)
                                                                FROM Roles
                                                                WHERE ShowID=${showID}
                                                                GROUP BY ActorID);`);
        // let res = pool.request().query(`SELECT DISTINCT Roles.ActorID, Actors.ActorName FROM Roles
        //                                 INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
        //                                 WHERE Roles.ShowID=${showID}`);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}

// const getMAL = async(Username) => {
//     try {        
//         let pool = await sql.connect(config);
//         let res = pool.request().query()
//         console.log(res);
//         return res;
//     }
//     catch(error) {
//         console.log(error);
//     }
// }

module.exports = {
    addActor,
    addAnime,
    getActor,
    getActorFull,
    getAnime,
    getHomeData,
    // getMAL,
    getSearchData,
    getShowActors,
    getRoles
}