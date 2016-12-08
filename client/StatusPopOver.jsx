import React from 'react';
import _ from 'underscore';

class StatusPopOver extends React.Component {
    getStatus() {
        var index = 0;

        var extendedStatuses = _.map(this.props.list, text => {
            return <li key={index++} className='text-danger'>{text}</li>;
        });

        return extendedStatuses;
    }
    
    render() {
        return (
            <ul className='hidden'>
                {this.getStatus()}
            </ul>
        );
    }
}

StatusPopOver.displayName = 'StatusPopOver';
StatusPopOver.propTypes = {
    list: React.PropTypes.array
};

export default StatusPopOver;
