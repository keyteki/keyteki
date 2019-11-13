import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class IdentityCard extends React.Component {
    render() {
        let className = classNames('panel', 'card-pile', this.props.className, {
            [this.props.size]: this.props.size !== 'normal',
            'vertical': true
        });
        return (
            <div className={ className } onMouseOver={ () => this.props.onMouseOver({ imageUrl: this.props.deckListUrl }) } onMouseOut={ this.props.onMouseOut }>
                <div className='card-wrapper'>
                    <div className='card-frame'>
                        <img className={ `card-image vertical ${this.props.size}` } src={ this.props.deckListUrl }/>
                    </div>
                </div>
            </div>
        );
    }
}

IdentityCard.displayName = 'IdentityCard';
IdentityCard.propTypes = {
    className: PropTypes.string,
    deckListUrl: PropTypes.string,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    size: PropTypes.string
};

export default IdentityCard;
