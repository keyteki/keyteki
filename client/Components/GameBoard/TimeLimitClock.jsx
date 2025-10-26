// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './TimeLimitClock.scss';

const TimeLimitClock = ({ timeLimitStarted, timeLimitStartedAt, timeLimit }) => {
    const [timeLeft, setTimeLeft] = useState(undefined);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timeLimitStarted && !timerRef.current) {
            timerRef.current = setInterval(() => {
                const endTime = moment(timeLimitStartedAt).add(timeLimit, 'minutes');
                const time = moment.utc(endTime.diff(moment())).format('mm:ss');
                setTimeLeft(time);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [timeLimitStarted, timeLimitStartedAt, timeLimit]);

    return (
        <div className='time-limit-clock card bg-dark border-primary'>
            <h1>{timeLeft}</h1>
        </div>
    );
};

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
