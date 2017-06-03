import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import Province from './Province.jsx';
import Placeholder from './Placeholder.jsx';
import {tryParseJSON} from '../util.js';

class StrongholdRow extends React.Component {
    constructor() {
        super();


    }

    render() {

        if(this.props.isMe) {

            return (
                <div className='stronghold-row'>
                    <div className='deck-cards'>
                        <Placeholder />
                        <Province source='stronghold province' cards={[]} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} disablePopup />
                    </div>
                </div>
            );
        } else {
            return (
                <div className='stronghold-row'>
                    <div className='deck-cards'>
                        <Placeholder />
                        <Placeholder />
                        <Placeholder />
                        <Placeholder />
                        <Placeholder />
                        <Placeholder />
                        <Province source='stronghold province' cards={[]} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} disablePopup />
                    </div>
                </div>
            );
        }
    }
}

StrongholdRow.displayName = 'StrongholdRow';
StrongholdRow.propTypes = {
    isMe: React.PropTypes.bool,
    spectating: React.PropTypes.bool
};

export default StrongholdRow;
