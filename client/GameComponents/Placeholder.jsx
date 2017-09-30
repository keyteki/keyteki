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
            <div className={ className } />);
    }
}

Placeholder.displayName = 'Placeholder';
Placeholder.propTypes = {
    className: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'bowed', 'vertical'])
};
Placeholder.defaultProps = {
    orientation: 'vertical'
};

export default Placeholder;
