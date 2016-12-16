import React from 'react';

class Avatar extends React.Component {
    render() {
        var className = 'gravatar';

        if(this.props.float) {
            className += ' pull-left';
        }

        return (<img className={className} src={'https://www.gravatar.com/avatar/' + this.props.emailHash + '?d=identicon&s=32}'} />);
    }
}

Avatar.displayName = 'Avatar';
Avatar.propTypes = {
    emailHash: React.PropTypes.string,
    float: React.PropTypes.bool
};

export default Avatar;
