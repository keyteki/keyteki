import React from 'react';
import PropTypes from 'prop-types';

import DeckStatusSummary from './DeckStatusSummary.jsx';
import StatusPopOver from './StatusPopOver.jsx';

class DeckStatus extends React.Component {
    render() {
        let { status } = this.props;
        let statusName;
        let className = 'deck-status';

        if(this.props.className) {
            className += ' ' + this.props.className;
        }

        if(!status.basicRules) {
            statusName = 'Invalid';
            className += ' invalid';
        } else if(!status.officialRole || !status.noUnreleasedCards) {
            statusName = 'Casual play only';
            className += ' casual-play';
        } else {
            statusName = 'Valid';
            className += ' valid';
        }

        return (
            <span className={ className }>
                <StatusPopOver status={ statusName } show>
                    <div>
                        <DeckStatusSummary status={ status } />
                        { status.extendedStatus && status.extendedStatus.length !== 0 &&
                            <ul className='deck-status-errors'>
                                { status.extendedStatus.map((error, index) => <li key={ index }>{ error }</li>) }
                            </ul>
                        }
                    </div>
                </StatusPopOver>
            </span>);
    }
}

DeckStatus.propTypes = {
    className: PropTypes.string,
    status: PropTypes.object.isRequired
};

export default DeckStatus;
