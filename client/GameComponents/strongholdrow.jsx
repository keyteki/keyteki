import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import {tryParseJSON} from '../util.js';

class StrongholdRow extends React.Component {
    constructor() {
        super();


    }

    render() {

        return (
            <div className='stronghold-row'>
                <div className='deck-cards'>
                    <CardCollection className='stronghold-province' source='stronghold province' cards={[]} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} disablePopup />
                </div>
            </div>
        );
    }
}

StrongholdRow.displayName = 'StrongholdRow';
StrongholdRow.propTypes = {
    isMe: React.PropTypes.bool,
    spectating: React.PropTypes.bool
};

export default StrongholdRow;
