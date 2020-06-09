import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AltCard extends React.Component {
    render() {
        let icons = [];

        if (this.props.card.icons) {
            for (let [icon, present] of Object.entries(this.props.card.icons)) {
                if (present) {
                    icons.push(
                        <div
                            className={`challenge-icon thronesicon thronesicon-${icon} with-background`}
                        />
                    );
                } else {
                    icons.push(<div className='challenge-icon' />);
                }
            }
        }

        return (
            <div className='card-alt'>
                <div className='card-top-row'>
                    {!['plot', 'agenda'].includes(this.props.card.type) && (
                        <div className='card-cost card-icon'>
                            <span className='card-cost-number'>{this.props.card.cost}</span>
                            <div className='card-type'>{this.props.card.type}</div>
                        </div>
                    )}
                    {['event', 'agenda'].includes(this.props.card.type) ? (
                        <div className='card-name'>
                            {this.props.card.unique ? <span className='card-unique' /> : null}{' '}
                            {this.props.card.name}
                        </div>
                    ) : (
                        <div className='card-name' />
                    )}
                    {['upgrade', 'event'].includes(this.props.card.type) && (
                        <div
                            className={`card-faction upgrade thronesicon thronesicon-${this.props.card.faction} with-background`}
                        />
                    )}
                </div>
                <div
                    className={classNames('card-icons', {
                        upgrade: ['upgrade', 'event', 'agenda'].includes(this.props.card.type)
                    })}
                >
                    {icons}
                </div>
                <div
                    className={classNames('card-name-row', {
                        vertical: this.props.card.type === 'artifact'
                    })}
                >
                    {this.props.card.strength && (
                        <div className='card-strength'>{this.props.card.strength}</div>
                    )}
                    {['creature', 'artifact'].includes(this.props.card.type) && (
                        <div className='card-name'>
                            {this.props.card.unique ? <span className='card-unique' /> : null}{' '}
                            {this.props.card.name}
                        </div>
                    )}
                    {['creature', 'artifact'].includes(this.props.card.type) && (
                        <div
                            className={`card-faction thronesicon thronesicon-${this.props.card.faction} with-background`}
                        />
                    )}
                </div>
                <div className='card-text'>
                    {['upgrade'].includes(this.props.card.type) && (
                        <div className='card-name'>
                            {this.props.card.unique ? <span className='card-unique' /> : null}{' '}
                            {this.props.card.name}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

AltCard.displayName = 'AltCard';
AltCard.propTypes = {
    card: PropTypes.object
};

export default AltCard;
