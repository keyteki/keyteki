import React from 'react';

import Province from './Province.jsx';
import Placeholder from './Placeholder.jsx';

class StrongholdRow extends React.Component {

    render() {

        if(this.props.isMe) {

            return (
                <div className='stronghold-row'>
                    <div className='deck-cards'>
                        <Placeholder />
                        <Province source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } />
                    </div>
                </div>
            );
        } 
        return (
            <div className='stronghold-row'>
                <div className='deck-cards'>
                    <Placeholder />
                    <Placeholder />
                    <Placeholder />
                    <Placeholder />
                    <Placeholder />
                    <Placeholder />
                    <Province source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } />
                </div>
            </div>
        );
        
    }
}

StrongholdRow.displayName = 'StrongholdRow';
StrongholdRow.propTypes = {
    isMe: React.PropTypes.bool,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    spectating: React.PropTypes.bool,
    strongholdProvinceCards: React.PropTypes.array
};

export default StrongholdRow;
