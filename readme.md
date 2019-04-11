# Mooncascade Take home test

!!! DEMO RUNS IN A LOOP WITH 30 SECONDS DELAY !!!

### Background: sports event timing

The task is about a fictional sports event, that needs an automatic timing system for the finish corridor and finish line. There are 2 automatic digital timing points/locations in the finish corridor:

1.  Entering into finish corridor 2. Crossing the finish line
From both of the timing points, the following information is sent to our server:
1. The code of the chip that is attached to the athlete/sportsmen (identifier)
2. The identifier of the timing point
3. The (wall)clock time with a precision of a fraction of second, when the athlete (the given chip) passed this timing point.
The database, that is prepared before the sports event, has a table with the following information about the athletes participating in the sports event:
1. The code/identifier of the chip that is attached to this athlete 2. The start number of the athlete
3. The full name (First name, Surname) of the athlete


# Implementation
## SERVER

The server solution is built with Express and Node.js.
The server uses HTTP endpoint to receive data from checkpoints, and  WebSocket connection to broadcast all the data and changes in real-time to all the connected clients. 

For this demo purpose, simplified implementation is used without strong security measures an authentication processing.

For data storing used Sqlite3.
The initial athlete's data is stored in the DB before the start.
It has two extra fields 'entering' and 'finish' where we will store the timestamp of corresponding checkpoints.

## UI APPLICATION

The UI Application is built with React / Redux, using SASS for styling and ES6.
The application presents the data table with Place, Starting Nr, Name, Finish time columns.

When the athlete passes the entry point - new record appears at the top of the table.
When the athlete passes the finish checkpoint time will be added to the corresponding table line.
Plase is set according to the finish time. So the first finished athlete gets 1 place and so on.

For the demo purpose, when all athletes are finished - application after 15 sec empty the table and start the process again.

## SIMULATOR

The simulator is a simple script that runs as a separate service and sends checkpoint data to the server with HTTP post request.

# STARTING UP THE DEMO

## Option 1 using Docker (recomended)
    1. Go to the root directory of the project (where docker-compose.yml file located).
    2. From the root directory of the project - run `docker-compose up --build`.
    It builds docker images and run the application.
    You can access the application on http://localhost:3000

## Option 2 using node ##
    1. Go to the root directory of the project (where docker-compose.yml file located)
    2. Installing the server. Go to the `server` folder (`cd server`) and run `npm install`.
    3. Starting the server. Run `npm run start`.
    Now the server is up and running on http://localhost:3355
    4. Installing the Application. Go to the `app` folder (`cd ../app`) and run `npm install`.
    5. Starting the Application. Run `npm run start`.
    6. Installing the Simulator. Go to the `simulator` folder (`cd ../server`) and run `npm install`.
    7. Starting the Simulator. Run `npm run start`.
    You can access the application on http://localhost:3000