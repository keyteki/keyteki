import React from 'react';
import PropTypes from 'prop-types';

class Placeholder extends React.Component {

    render() {
        var className = 'panel placeholder ' + this.props.className;

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
    className: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'bowed', 'vertical']),
    source: PropTypes.oneOf(['hand', 'dynasty discard pile', 'conflict discard pile', 'play area', 'dynasty deck', 'conflict deck', 'province deck', 'province 1', 'province 2', 'province 3', 'province 4', 'attachment', 'stronghold province', 'additional']).isRequired
};
Placeholder.defaultProps = {
    orientation: 'vertical'
};

export default Placeholder;
