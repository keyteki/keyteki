import React from 'react';

import Province from './Province.jsx';
import Placeholder from './Placeholder.jsx';
import CardCollection from './CardCollection.jsx';

class StrongholdRow extends React.Component {

    render() {

        if(this.props.isMe) {

            return (
                <div className='stronghold-row'>
                    <div className='deck-cards'>
                        { this.props.role ? <CardCollection className='rolecard' source='role card' cards={ [] } topCard={ this.props.role } disablePopup
                            onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                            onDragDrop={ this.props.onDragDrop } /> : <Placeholder /> }
                        <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } />
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
                    <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } />
                    { this.props.role ? <CardCollection className='rolecard' source='role card' cards={ [] } topCard={ this.props.role } disablePopup
                        onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                        onDragDrop={ this.props.onDragDrop } /> : '' }
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
    role: React.PropTypes.object,
    spectating: React.PropTypes.bool,
    strongholdProvinceCards: React.PropTypes.array
};

export default StrongholdRow;
