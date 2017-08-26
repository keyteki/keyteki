import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import {tryParseJSON} from '../util.js';

class Placeholder extends React.Component {
    constructor() {
        super();

    }


    render() {
        var className = 'panel placeholder ' + this.props.className;
        var cardOrientation = this.props.orientation;

        if(this.props.orientation === 'horizontal') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        return (
            <div className={ className } onDragLeave={ this.onDragLeave } onDragOver={ this.onDragOver } onDrop={ event => this.onDragDrop(event, this.props.source) }
                onClick={ this.onCollectionClick } />);
    }
}

Placeholder.displayName = 'Placeholder';
Placeholder.propTypes = {
};
Placeholder.defaultProps = {
    orientation: 'vertical'
};

export default Placeholder;
