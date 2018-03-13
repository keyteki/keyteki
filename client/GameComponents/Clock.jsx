import React from 'react';
import PropTypes from 'prop-types';

const formattedSeconds = (sec) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

class Clock extends React.Component {
    constructor() {
        super();

        this.state = { timeLeft: 0 };
    }

    componentWillReceiveProps(newProps) {
        if(newProps.secondsLeft === 0) {
            return;
        }
        if(this.secondsLeft !== newProps.secondsLeft) {
            this.secondsLeft = newProps.secondsLeft;
            this.setState({ timeLeft: newProps.secondsLeft });
        }

        if(this.timerHandle) {
            clearInterval(this.timerHandle);
        }

        if(newProps.active) {
            this.timerHandle = setInterval(() => {
                this.setState({
                    timeLeft: this.state.timeLeft - 1
                });
            }, 1000);
        } 

    }

    render() {
        let className = 'player-stats-row';
        if(this.props.active) {
            className += ' clock-active';
        }
        return (
            <div className={ className }>
                { formattedSeconds(this.state.timeLeft) }
            </div>
        );
    }
}

Clock.displayName = 'Clock';
Clock.propTypes = {
    active: PropTypes.bool,
    secondsLeft: PropTypes.number
};

export default Clock;
