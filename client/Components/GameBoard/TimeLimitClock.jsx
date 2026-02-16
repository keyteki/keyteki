import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const TimeLimitClock = (props) => {
    const [timeLeft, setTimeLeft] = useState();

    useEffect(() => {
        if (!props.timeLimitStarted) {
            setTimeLeft(undefined);
            return;
        }

        const tick = () => {
            const endTime = moment(props.timeLimitStartedAt).add(props.timeLimit, 'minutes');
            setTimeLeft(moment.utc(endTime.diff(moment())).format('mm:ss'));
        };

        tick();
        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, [props.timeLimit, props.timeLimitStarted, props.timeLimitStartedAt]);

    return (
        <div className='mt-[-6px] border border-primary bg-dark px-2 pt-1 font-["Orbitron",sans-serif] font-medium text-secondary'>
            <h1 className='ml-[23%] w-28 text-[2rem]'>{timeLeft}</h1>
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
