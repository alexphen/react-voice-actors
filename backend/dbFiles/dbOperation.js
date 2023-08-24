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
        console.log(res);
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
        console.log(res);
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
    getAnime,
    getHomeData,
    // getMAL,
    getSearchData,
    getShowActors,
    getRoles
}