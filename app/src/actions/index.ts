import * as constants from '../constants';

/* INTERFACES */
export interface Athlet {
    id: number;
    code: string;
    start_nr: string;
    full_name: string;
    entering: number;
    finish: number;

}

export interface setAuthleteDateType {
    type: typeof constants.SET_RESULTS;
    data: Athlet[] | [];
}

/* ACTIONS */
// Set Data
export const setAthletesData: Function =
(data: Athlet[]): setAuthleteDateType => {
    return {
        type: constants.SET_RESULTS,
        data,
    };
};
