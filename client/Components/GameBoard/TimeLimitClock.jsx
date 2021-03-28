import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimeLimitClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: undefined,
            timeLeft: undefined
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        if (props.timeLimitStarted && !this.state.timer) {
            let timer = setInterval(() => {
                let endTime = moment(this.props.timeLimitStartedAt).add(
                    this.props.timeLimit,
                    'minutes'
                );
                let time = moment.utc(endTime.diff(moment())).format('mm:ss');
                this.setState({ timeLeft: time });
            }, 1000);

            this.setState({ timer: timer });
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.timeLeft}</h1>
            </div>
        );
    }
}

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
