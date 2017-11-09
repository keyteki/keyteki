import React from 'react';
import PropTypes from 'prop-types';

class Avatar extends React.Component {
    render() {
        var className = 'gravatar';

        if(this.props.float) {
            className += ' pull-left';
        }

        return (<img className={ className } src={ 'https://www.gravatar.com/avatar/' + this.props.emailHash + '?d=identicon&s=24' + (this.props.forceDefault ? '&f=y' : '') } />);
    }
}

Avatar.displayName = 'Avatar';
Avatar.propTypes = {
    emailHash: PropTypes.string,
    float: PropTypes.bool,
    forceDefault: PropTypes.bool
};

export default Avatar;
