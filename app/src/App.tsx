import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageVisibility from 'react-page-visibility';

import { setAthletesData, setAuthleteDateType, Athlet } from './actions';
import { State } from './reducers';
import './App.scss';
import List from './components/List/List';

export interface Props {
  athlets: Athlet[];
  setAthletes: Function;
}

interface ComponentState {
  update: boolean;
  visible: boolean;
}

export class App extends Component<Props, ComponentState> {
// define socket
  socket: any;

  constructor(props: Props){
    super(props);

    this.state = {
      update: false,
      visible: true,
    }

  }

  componentDidMount(){
    this.openWebsocketConnection();
  }

  closeWebsocketConnection() {
    this.socket.close();
  }

  openWebsocketConnection(){
    this.socket = new WebSocket('ws://localhost:3355/');
    this.socket.onmessage = ({ data }: any) => {

        const response = JSON.parse(data);
        if (response.length === 0 ) { 
          setTimeout(() => {
            this.props.setAthletes([])
          }, 15000)};

        const validData = this.validateResponse(response);

        if (!validData) return;

        this.processData(validData);
    }
  }

  validateResponse(response: any){
    return response
      && Array.isArray(response)
      && response.length > 0
      && response[0].id
      && response[0].code
      && response[0].full_name
      && response[0].entering
      ? response
      : false
    ;
  }

  processData(data: any) {

    // if response contain more than 1 athlete 
    // (means new connection or gap in session) 
    // - we should update whole state 
    if (data.length > 1){
      this.props.setAthletes(data);
    } else {
      this.updateOrAddAthlet(data[0]);
    }
  }

  updateOrAddAthlet(update: Athlet){ 
    // check if recived athlet already in the list
    let isAthetInTheList: boolean | number = false;

    this.props.athlets.forEach((athlet, index) => {
      if (athlet.id === update.id) {
        isAthetInTheList = index;
      }
    });
    // if not add to the list
    if (isAthetInTheList === false) {

      let newList = this.props.athlets;
      newList.push(update);
      this.props.setAthletes(newList);
      this.setState({update: !this.state.update});

    } else {
      // if is in the list - update
      let updatedList = this.props.athlets;
      updatedList[isAthetInTheList] = update;
      this.props.setAthletes(updatedList);
      this.setState({update: !this.state.update});

    }
  }
    // close connection if browser window inactive and reconnect if active
    handleVisibilityChange = (isVisible: boolean) => {

      if (isVisible) {
          this.openWebsocketConnection();
      } else {
        this.closeWebsocketConnection();
      }
  }

  render(): any {

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="app">
          <List athlets={this.props.athlets}/>
        </div>
      </PageVisibility>
    );
  }
}
const mapStateToProps = ({athlets}:State) => {
  return {athlets};
};

const mapDispatchToProps = (dispatch: Dispatch<setAuthleteDateType>) => {
  return {
      setAthletes: (data: State) =>
      dispatch(setAthletesData(data))

  };
} 
export default connect(mapStateToProps, mapDispatchToProps)(App);
