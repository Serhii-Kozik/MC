import React from 'react';
import ListItem , { ItemProps } from '../ListItem';
import Enzyme ,{ shallow }from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('List component', () => {

    it('should render correctly if title', () => {
        const props: ItemProps =  {
            title:             true,
            index:             1,
            place:             'Place',
            athletNumber:      'F4',
            athletFullName:    'Name',
            athletFinishTime:  'Finish',
          };

        const component = shallow(<ListItem {...props}/>);
        expect(component).toMatchSnapshot();
        expect(component.find('.table-line.title').length).toBe(1);
    });

    it('should render correctly if table row', () => {
        const props: ItemProps =  {
            title:             false,
            index:             1,
            place:             'Place',
            athletNumber:      'F4',
            athletFullName:    'Name',
            athletFinishTime:  '1234343433',
          };

        const component = shallow(<ListItem {...props}/>);
        expect(component.find('.table-line.results').length).toBe(1);
        expect(component.find('.finished').length).toBe(1);

        component.setProps({place:''});
        component.update();
        expect(component.find('.finished').length).toBe(0);
        expect(component.find('.aproaching').length).toBe(1);

    });
});