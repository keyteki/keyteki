import React from 'react';
import PropTypes from 'prop-types';

class Placeholder extends React.Component {

    render() {
        var className = `panel placeholder ${this.props.className || ''}`;

        if(this.props.orientation === 'horizontal') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        if(this.props.size !== 'normal') {
            className += ` ${this.props.size}`;
        }

        return (
            <div className={ className }>
                <div className='card-placeholder'/>
            </div>
        );
    }
}

Placeholder.displayName = 'Placeholder';
Placeholder.propTypes = {
    className: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'bowed', 'vertical']),
    size: PropTypes.string
};
Placeholder.defaultProps = {
    orientation: 'vertical'
};

export default Placeholder;
