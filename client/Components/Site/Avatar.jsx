import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Avatar extends React.Component {
    render() {
        let className = classNames('gravatar', {
            'pull-left': this.props.float
        });

        if (!this.props.username) {
            return null;
        }

        return <img className={className} src={`/img/avatar/${this.props.username}.png`} />;
    }
}

Avatar.displayName = 'Avatar';
Avatar.propTypes = {
    float: PropTypes.bool,
    username: PropTypes.string
};

export default Avatar;
