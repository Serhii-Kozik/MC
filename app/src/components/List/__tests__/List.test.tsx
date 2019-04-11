import React from 'react';
import List , { Props } from '../List';
import Enzyme ,{ shallow }from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('List component', () => {

    it('should render correctly', () => {
        const props: Props =  {
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
          };

        const component = shallow(<List {...props}/>);
        expect(component).toMatchSnapshot();
    });
});