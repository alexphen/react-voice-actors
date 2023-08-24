const exp           = require('constants'),
      Anime         = require('./dbFiles/anime'),
      express       = require('express'),
      dbOperation   = require('./dbFiles/dbOperation'),
      cors          = require('cors'); 

const API_PORT = process.env.PORT || 5000;
const app = express();
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// app.post('/mal', async(req, res) => {
//     console.log('Called');
//     const result = await dbOperation.getMAL(req.body.Username)
//     res.send(result.recordset); 
// })

app.post('/api', async(req, res) => {
    console.log('Called');
    const result = await dbOperation.getAnime(req.body.Title)
    res.send(result.recordset);    
})

app.post('/hello', async(req, res) => {
    await dbOperation.addAnime(req.body);
    const result = await dbOperation.getAnime(req.body.Title)
    console.log('Called quit');
    res.send(result.recordset);  
})

app.post('/actor', async(req, res) => {
    console.log('Called actor', req.body);
    const result = await dbOperation.getActor(req.body.ActorID)
    console.log(result.recordset)
    res.send(result.recordset);  
})

app.post('/home', async(req, res) => {
    console.log('Called home', req.body);
    const result = await dbOperation.getHomeData(req.body.ActorID)
    // console.log(result.recordset)
    res.send(result.recordset);  
})

app.post('/search', async(req, res) => {
    console.log('Called search', req.body);
    const result = await dbOperation.getSearchData(req.body.Title)
    // console.log(result.recordset)
    res.send(result.recordset);  
})

app.post('/show', async(req, res) => {
    console.log('Called show', req.body);
    const result = await dbOperation.getShowActors(req.body.ShowID)
    // console.log(result.recordset)
    res.send(result.recordset);  
})

app.post('/roles', async(req, res) => {
    console.log('Called roles', req.body);
    const result = await dbOperation.getRoles(req.body.ActorID)
    console.log(result.recordset)
    res.send(result.recordset);  
})


// let test = new Anime(-1, "Test Anime", "https://img.freepik.com/free-photo/puppy-that-is-walking-snow_1340-37228.jpg?w=2000")
// console.log(test)

// dbOperation.addAnime(test);

// dbOperation.getActor(0).then(res => {
//     console.log("manual call")
//     console.log(res.recordset);
// })


app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));