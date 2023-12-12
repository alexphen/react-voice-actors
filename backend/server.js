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

const API_PORT = process.env.PORT || 3000;
const app = express();
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
// app.use(express.static('build'))


// OracleDB Initialization
async function init() {
    try {
      await oracledb.createPool({
        user: 'ADMIN',
        password: 'loonSQLserver1',
        connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g1e4482f6c79339_id7iztfouvg8omj1_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
      });

        let connection;
        try {
            // get connection from the pool and use it
            connection = await oracledb.getConnection();
        } catch (err) {
            console.log("err1");
            throw (err);
        } finally {
            if (connection) {
                try {
                    await connection.close(); // Put the connection back in the pool
                } catch (err) {
                console.log("err2");
                    throw (err);
                }
            } else {
                console.log("no connection")
            }
        }
    } catch (err) {
        console.log(err.message);
    }
    
    
    app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
}

init();



app.post('/api/actor', async(req, res) => {
    try {
        console.log('Called actor', req.body);
        const result = await dbOperation.getActor(req.body.ActorID)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/homeActor', async(req, res) => {
    try {
        console.log('Called home actors', req.body.flag);
        const result = await dbOperation.getHomeActors(req.body.flag, req.body.myList)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/actorFull', async(req, res) => {
    try {
        console.log('Called actorFull', req.body.ActorID, req.body.flag);
        const result = await dbOperation.getActorFull(req.body.ActorID, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/mal', async(req, res) => {
    try {
        console.log('Called mal', req.body);
        const result = await dbOperation.getMAL(req.body.Username)
        console.log(result.data.length)
        res.send(result); 
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/roles', async(req, res) => {
    try {
        console.log('Called roles', req.body.ActorID);
        const result = await dbOperation.getRoles(req.body.ActorID, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/search', async(req, res) => {
    try {
        console.log('Called search', req.body.Title);
        const result = await dbOperation.getSearchData(req.body.Title, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/searchActor', async(req, res) => {
    try {
        console.log('Called search actor', req.body.name);
        const result = await dbOperation.getSearchActorData(req.body.name, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/show', async(req, res) => {
    try {
        console.log('Called show', req.body);
        const result = await dbOperation.getShowActors(req.body.ShowID)
        // console.log("result", result, count)
        res.send(result.rows);
        
    } catch (error) {
        console.log(error)
        
    }
})

// dbOperation.getActor(1).then(res => {
//     console.log("manual call")
//     console.log(res.rows);
// })


// app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));