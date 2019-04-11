import React from 'react';
import { App, Props } from './App';
import Enzyme ,{ shallow }from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('APP component', () => {
  let component: any;
  let props: Props;

  beforeEach(() => {
    props = {
      athlets: [
        {
          id: 1,
          code: '123',
          start_nr: '123',
          full_name: 'first name',
          entering: 1,
          finish:2
        },
        {
          id: 2,
          code: '124',
          start_nr: '124',
          full_name: 'first name',
          entering: 2,
          finish:1
        },
      ],
      setAthletes: jest.fn(),
      
    }
    component = shallow(<App {...props}/>);
  });

  it('to match snapshot', () => {
    
    expect(component).toMatchSnapshot();
  });

  it('tryes to open websocket connection', () => {
    const spy = jest.spyOn(component.instance(), 'openWebsocketConnection');
    component.instance().componentDidMount();
    expect(spy).toBeCalled();
  });

  it('validates data correctly', () => {
    const validData = [
      {
        id: 2,
        code: '124',
        start_nr: '124',
        full_name: 'first name',
        entering: 2,
        finish:1
      }
    ];
    const valid = component.instance().validateResponse(validData);
    const invalidArray = component.instance().validateResponse([]);
    const invalidString = component.instance().validateResponse('string');

    expect(valid).toBe(validData);
    expect(invalidArray).toBe(false);
    expect(invalidString).toBe(false);
  });

  it('processData sets state if response array legth > 1', () => {
    component.instance().processData(props.athlets);
    expect(component.instance().props.setAthletes).toBeCalledWith(props.athlets);
  });

  it('processData calls update function if if response array legth = 1', () => {
    const responce = [
      {
        id: 1,
        code: '123',
        start_nr: '123',
        full_name: 'first name',
        entering: 1,
        finish:2
      },
    ];
    const spy = jest.spyOn(component.instance(), 'updateOrAddAthlet')
    component.instance().processData(responce);
    expect(spy).toBeCalledWith(responce[0]);
  });

  it('handleVisibilityChange sets correct state', () => {
    const spyOpen = jest.spyOn(component.instance(), 'openWebsocketConnection');
    const spyClose = jest.spyOn(component.instance(), 'closeWebsocketConnection');

    component.instance().handleVisibilityChange(true);
    expect(spyOpen).toBeCalled();

    component.instance().handleVisibilityChange(false);
    expect(spyClose).toBeCalled();
  });

  it('updateOrAddAthlet ubdates value if athlet in the list', () => {
    const spySetState = jest.spyOn(component.instance(), 'setState');
    component.instance().updateOrAddAthlet(props.athlets[0]);
    expect(component.instance().props.setAthletes).toBeCalledWith(props.athlets);
    expect(spySetState).toBeCalledWith({update: true});
    
  });

  it('updateOrAddAthlet adds new athlet if not in the list', () => {
    const spySetState = jest.spyOn(component.instance(), 'setState');
    const newAthlet = {
      id: 3,
      code: '124',
      start_nr: '124',
      full_name: 'first name',
      entering: 4,
      finish:5
    };
    const newList = props.athlets;
          newList.push(newAthlet);
    component.instance().updateOrAddAthlet(newAthlet);
    expect(component.instance().props.setAthletes).toBeCalledWith(newList);
    expect(spySetState).toBeCalledWith({update: true});
  });

});
