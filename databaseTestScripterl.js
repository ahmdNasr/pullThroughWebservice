
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
////////////////////////////   DECLARE CQL   ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// anasr uuid = a80d96c6-0419-11e7-93ae-92361f002671


/*
{
  "user_id": "d206fed0-a4f7-11e6-91a5-1fc490c5cf69",
  "email": "michael.mayer@spengergasse.at",
  "firstname": "Michael",
  "lastname": "Mayer",
  "username": "michaelmayer61"
}
*/

const cql = "select * from comundo_prod.eventdetails_by_event_id where type = ? and venue = ? and tags contains ? allow filtering;"
const params = ["public", "25hours Hotel", "theatre"]
//const params = []
/*
const cql = "SELECT firstname, lastname, email, username, follower_id FROM followers_by_user WHERE user_id = ? and bucket = ?;"
const params = ["d20921c8-a4f7-11e6-91a5-1fc490c5cf69", "2017"]



const cql = "INSERT INTO user_by_username(username, firstname, lastname, description) VALUES(?, ?, ?, ?);" 
const params = ["anasr",  "Ahmed", "Nasr", "Abstraction is the key!"]

const cql = "SELECT * FROM user_by_username WHERE username = ?;"
const params = ["describe table user_by_username;"]//, "daniel"]

// const params = ["a80d96c6-0419-11e7-93ae-92361f002671", "Ahmed", "Nasr", "anasr", "Abstraction is the key!", 1, false]

*/

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////     END      /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

console.log("Testing started...")

const cassandra = require ('cassandra-driver')
const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider 


const config = { 
	contactPoints: ['195.88.35.57','195.88.35.61','195.88.35.64'], 
	keyspace: 'comundo_prod',
	authProvider: new PlainTextAuthProvider('std_harl', 'wfW4!S6V&A_A96_5fWc9+7#BRMo+XPCX' )
}

const client = new cassandra.Client(config)
console.log("Client created...")

const connect = () => {
    let deferedObject = Promise.defer()

    console.log("Trying to establish a connection...")
    
    client.connect((err) => {
        if (err) {
            client.shutdown();
            console.log('There was an error when connecting, client will shutdown connection.', err)
            deferedObject.reject()
        } else { 
            console.log('Connected to cluster with %d host(s): %j\n', client.hosts.length, client.hosts.keys())
            deferedObject.resolve()
        }   
    })

    return deferedObject.promise
}

const execute = () => {
    let deferedObject = Promise.defer();

    console.log("Executing CQL...")
    console.log("cql: " + cql)
    console.log("params: " + params + "\n")

    client.execute(cql, params,  { prepare: true }, (err, result) => {
        err 
        ? deferedObject.reject(err)
        : deferedObject.resolve("RESULT: " + JSON.stringify( result.rowLength <= 1 ? result.rows[0] : result.rows, null, 2) )
    }) 

    return deferedObject.promise
}

// execute everything
connect()
.then(execute)
.then(console.log)
.then(() => client.shutdown())
.catch(console.log)