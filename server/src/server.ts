/**
 * For this test task I will keep all the code in one file.
 * It will be more comfortable to review the code.
 * In this file I will implement express server endpoint to receive data from checkpoints.
 * And WebSocket server for broadcasting updates to the Web user interface.
 * I will use Sqlite3 database to keep things simple, it is good enough for this demo.
 * ## Description:
 * - We have Athletes database that is predefined and prefilled before the race starts.
 * - We have an endpoint to receive information from checkpoints.
 * - We have WebSocket server up and running for Web interface connections. 
 * ##Flow:
 * - On WebSocket connection:
 *      - select all the athletes passed entry point
 *      - send an array of athletes (if any) to a newly connected client
 * - On receive information from checkpoint:
 *      - validate request
 *      - update athlete DB record, set the timestamp to the corresponding checkpoint
 *      - broadcast athlete DB record to all connected clients.
 */

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as sqlite3 from 'sqlite3';

import { athletesList } from './athletesList';

// INTERFACES
interface Timing {
    code:   string;
    point:  string;
    time:   number;
    last: boolean;
}

interface Athlet {
    code:       string;
    start_nr:   string;
    full_name:  string; 
    entering?:  number;
    finish?:    number;
}

interface ErrorResponse {
    status: number;
    message: string;
}

// Database
let db = new sqlite3.Database('./data/athletes', (err) => {

    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
    
  });

/**
 * Function creates table if not exist and populate it with predefined data
 */
const serializeDB: Function = (): void => {

    db.serialize(function() {
        db.run(
            `CREATE TABLE IF NOT EXISTS athletes
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE,
                start_nr TEXT,
                full_name TEXT,
                entering INTEGER,
                finish INTEGER
            )`,
            (err) => {
                if (err) {
                    return console.log(err.message);
                }
    
                // populate db with athletes data if empty
                maybePopulateDb();
            }
        );
    
        db.run(
            `CREATE UNIQUE INDEX IF NOT EXISTS chipCode 
                ON athletes (code)`
        );
    });
}

// Create DB file if not exist
// Assume that entry point and cross point names are predefined and 
// the same across the application ('entering','finish').
serializeDB();

// Server setup
const app = express();
// Use JSON parser
app.use(express.json());


// Set post endpoint
app.post('/timing', (req, res) => {

    // validate recived data
    const validData = isValidRequest(req.body);

    // if data is invalid reject
    if (!validData){console.log('invalid checkpoint data');
        return res.status(400).send('Bad request');
    }

    // define timing point
    const point = validData.point;

    // save timing to db if not already set
    db.run( `UPDATE athletes SET ${point} = ? WHERE code = ? AND ${point} IS NULL`,
    [
        validData.time,
        validData.code,
    ], 
    function(err) {

        if (err) { // notify if error

            return res.status(500).send(err.message);

        } else if (this.changes > 0){ // simple check to avoid double checkin
    
            // timing saved successfully, let's get updated row and broadcast it to all active clients
            notifyClients(validData);
        } 
        // respond with success to point data provider
        return res.status(201).send('Success.');
    });
});


// http server
const server = http.createServer(app);


// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    // on initial connection select all athletes passed entering point   
    db.all(`SELECT * FROM athletes WHERE entering IS NOT NULL`, (err, data) => {

        // show message if error 
        if (err) { 

            const response = JSON.stringify((prepareErrorResponse(500, 'DB problem.')));
            return ws.send(response);
        }

        // Respond with athletes array or an empty array if nobody enters the corridor yet.
        ws.send(JSON.stringify(data));
    });
});

//start our server
server.listen(process.env.PORT || 3355, () => {

    console.log('Server started.');
});


/** HELPER FUNCTIONS */ 

/**
 * timing request very basic validation
 * @param request 
 * @returns Timing object or false
 */
const isValidRequest: Function = (request: any): boolean | Timing => {

    return (
        request.code
        && request.point
        && request.time
        ? request
        : false
    );
};

const maybePopulateDb: Function = (): void => {

    db.all(`SELECT count(*) as records FROM athletes`, (err, count) => {

        // show message if error 
        if (err) { 
          return console.log('[ERROR]: Can not select from DB!'); 
        }

        // check if data in database and insert if empty
        if ( count[0].records  === 0) {

            insertInitialData(athletesList);
        }
    });
};

/**
 * This function adds athlets from athletes list to DB
 */
const insertInitialData: Function = (list: Athlet[]): void => {

    list.map((athlet, index) => {
        db.run(`INSERT INTO athletes(code, start_nr, full_name) VALUES (?, ?, ?)`,
        athlet,(err) => {
            return err 
            ? console.log('[Error]: Can not insert to DB! ' + err.message)
            : console.log(`Athlet ${index + 1} been added successfuly.`);
        });
    });
}

const notifyClients: Function = (validData: Timing): void => {

    db.get(`SELECT * FROM athletes WHERE code = ?`,validData.code, (err, data) => {

        // show message if error 
        if (err) { 
            console.log(err.message);
        }

        // Broadcast just registered timing to all the clients
        wss.clients.forEach(function each(client) {

            const dataArray = [data];
            client.send(JSON.stringify(dataArray));
        });

        // If it was last athlete clear the DB and load fresh data to run again
        if (validData.last) {        
           refrashDB();
        }

    });
}

/**
 * Prepares response object
 * @param status code of the error
 * @param message error message
 * @returns ErrorResponse object  {status: 500, message: Server failure.}
 */
const prepareErrorResponse: Function = (status: number, message : string): ErrorResponse => {
    return {status, message};
}

/**
 * Functions drops athletes table and creates new one with fresh data 
 */
const refrashDB: Function = (): void => {

     // Broadcast empty result to all the clients
     wss.clients.forEach(function each(client) {

        const dataArray: [] = [];
        client.send(JSON.stringify(dataArray));
    });

    db.run(`DROP TABLE athletes`, (err) => {

        if (err) {
        return console.error(err.message);
        }
        // create fresh DB and porulate with new data
        serializeDB();
    });
}
