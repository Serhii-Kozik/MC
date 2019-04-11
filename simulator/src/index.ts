import axios from "axios";

import { simulatorData , PointData} from './simulatorData'; 

/**
 * Function simulates the race athlets checkin
 */
const runSimulation: Function = (data: PointData[]): void => {

    const last = data.length - 1;
    let timeout = 0;
    const serverHost = process.env.SERVER_HOST ? `http://${process.env.SERVER_HOST}:3355`: 'http://localhost:3355';

    data.map((checkin, index) => {
        timeout += checkin.delay;
        // set timeout to simulate real race checkin
        setTimeout(() => {
    
            // Send post request to the main server
            axios.post(serverHost + '/timing', 
                {
                    code: checkin.code,
                    point: checkin.point,
                    time: new Date().getTime(),
                    last: index === last ? true : false
                }
            )
            .then(function (response) {
                // rerun simulation if last athete data was sent 
                if (index === last) {
                    rerunSimulation();
                }
            })
            .catch(function (error) {
                console.log('Connection problem. ', error.message);
            });
    
        }, timeout);
    });

}

const rerunSimulation: Function = () => {

    setTimeout(() => {
        runSimulation(simulatorData);
    }, 30000);
}

// Run race simulation
runSimulation(simulatorData);