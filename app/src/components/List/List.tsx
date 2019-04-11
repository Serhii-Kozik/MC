import React from 'react';
import { Athlet } from '../../actions';
import ListItem from '../ListItem/ListItem';

import FlipMove from 'react-flip-move';
import './List.scss';

export interface Props {
    athlets: Athlet[];
}

class List extends React.Component<Props> {

    render(){
        // sort the athletes by finish time (those who don't finish yet will be on top) 
        const sortedList = this.props.athlets.sort(function(a,b){
            return a.finish - b.finish;
          });
        // prepare place 
        let place: number = 0;
    
        const listItems = sortedList.map((athlet, index) => {
            // assign place to the athlet
            place = athlet.finish !== null ? place + 1 : place;
                // return athlet table line
                return <ListItem
                        key={athlet.start_nr}
                        index={index}
                        place={place ? place : ''}
                        athletNumber={athlet.start_nr}
                        athletFullName={athlet.full_name}
                        athletFinishTime={athlet.finish}
                    />
        });
        // render athletes in a list
        return( 
            <div className='results-container'>
                <ListItem
                    title={true}
                    place='Place'
                    athletNumber='Start Nr'
                    athletFullName='Name'
                    athletFinishTime='Time'
                />
                <FlipMove // animate in and order change
                staggerDurationBy='30'
                duration={500}
                enterAnimation='accordionVertical'
                leaveAnimation='elevator'
                 >
                    {listItems}
                </FlipMove>
            </div>
        );
    }
}

export default List;