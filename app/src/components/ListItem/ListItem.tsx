import React from 'react';

import stopwatchIcon from './stopwatch.svg';
import trophyIcon from './trophy-alt.svg';
import './ListItem.scss';

export interface ItemProps {
    title?:             boolean;
    index?:             number;
    place:              number | string;
    athletNumber:       string;
    athletFullName:     string;
    athletFinishTime:   number | string;
}

class ListItem extends React.Component<ItemProps> {

    render(){
        // Set time
        let timeValue: string = '';
        // if recive number - return time string
        if (typeof this.props.athletFinishTime === 'number'){

            const time: Date = new Date(this.props.athletFinishTime);
            timeValue = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;

        } else {
            // if recive empty string proceed with it
            timeValue = this.props.athletFinishTime;
        }
        
        // define dynamic CSS classes
        const cssLineClass = this.props.title ? ' table-line title ' : ' table-line results';
        const cssNotFinishedClass = this.props.place === '' ? ' aproaching ' : ' finished ';
        // Render atlet table row
        return (
            <div className={cssLineClass + cssNotFinishedClass}>
                <div className='col place'>
                    <span className='content'>
                        { this.props.title ? '' : <img src={trophyIcon}/>}
                        {this.props.place}
                    </span>
                </div>
                <div className='col starting-number'>
                    <span className='content'>
                        {this.props.athletNumber}
                    </span>
                </div>
                <div className='col full-name'>
                    <span className='content'>
                        {this.props.athletFullName}
                    </span>
                </div>
                <div className='col finish-time'>
                    <span className='content'>
                        {this.props.title ? '' : <img src={stopwatchIcon}/>}
                        {timeValue == null ? 'approaching' : timeValue}
                    </span>
                </div>
            </div>
        );

    }
}

export default ListItem;