const exp           = require('constants'),
      Anime         = require('./dbFiles/anime'),
      express       = require('express'),
      dbOperation   = require('./dbFiles/dbOperationOracle'),
      cors          = require('cors'),
      oracledb      = require('oracledb'),
      MAL           = require("myanimelist-api-wrapper"),
      sql           = require('mssql'),
      dbConfig      = require('./dbFiles/dbConfig');
const { config }    = require('process');

const API_PORT = process.env.PORT || 5000;
const app = express();
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(express.static('build'))

app.post('/api/actor', async(req, res) => {
    try {
        console.log('Called actor', req.body);
        const result = await dbOperation.getActor(req.body.ActorID)
        // console.log(result.recordset)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/actorFull', async(req, res) => {
    try {
        console.log('Called actorFull', req.body);
        const result = await dbOperation.getActorFull(req.body.ActorID, req.body.flag)
        console.log(result)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/home', async(req, res) => {
    try {
        console.log('Called home', req.body);
        const result = await dbOperation.getHomeData(req.body.ActorID)
        // console.log(result.recordset)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/list', async(req, res) => {
    try {
        console.log('Called list', req.body);
        const result = await dbOperation.setList(req.body.ids)
        // console.log(result)
        res.send(result);
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/mal', async(req, res) => {
    try {
        console.log('Called mal', req.body);
        const result = await dbOperation.getMAL(req.body.Username)
        // console.log(result)
        res.send(result); 
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/roles', async(req, res) => {
    try {
        console.log('Called roles', req.body);
        const result = await dbOperation.getRoles(req.body.ActorID, req.body.flag)
        // console.log(result.recordset)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/search', async(req, res) => {
    try {
        console.log('Called search', req.body);
        const result = await dbOperation.getSearchData(req.body.Title, req.body.flag)
        // console.log(result.recordset)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/searchActor', async(req, res) => {
    try {
        console.log('Called search actor', req.body);
        const result = await dbOperation.getSearchActorData(req.body.Title, req.body.flag)
        // console.log(result.recordset)
        res.send(result.recordset);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/show', async(req, res) => {
    try {
        console.log('Called show', req.body);
        const result = await dbOperation.getShowActors(req.body.ShowID)
        // console.log("result", result, count)
        res.send(result.recordset);
        
    } catch (error) {
        console.log(error)
        
    }
})




// let test = new Anime(-1, "Test Anime", "https://img.freepik.com/free-photo/puppy-that-is-walking-snow_1340-37228.jpg?w=2000")
// console.log(test)

// dbOperation.addAnime(test);

// dbOperation.getActor(1).then(res => {
//     console.log("manual call")
//     console.log(res.recordset);
// })


app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));