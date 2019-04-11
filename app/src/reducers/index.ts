import * as constants from '../constants';
import  { setAuthleteDateType, Athlet } from '../actions';

export interface State {
    athlets: Athlet[] | [];
}

const initialState: State = {
    athlets: [
        // {
        //     id: 1,
        //     code: 'qwe345',
        //     start_nr: '123E',
        //     full_name: 'First Athlet',
        //     entering: 0,
        //     finish: 155478123432,
        // }
    ]
}

function Athletes(state: State = initialState, action: setAuthleteDateType) {
    switch (action.type) {
      case constants.SET_RESULTS:
        return {...state, athlets: action.data }
      default:
        return state
    }
  }

  export default Athletes;