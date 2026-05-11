import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const TimeLimitClock = (props) => {
    const [timeLeft, setTimeLeft] = useState(() => {
        if (props.timeLimit) {
            const mins = String(props.timeLimit).padStart(2, '0');
            return `${mins}:00`;
        }
        return undefined;
    });

    useEffect(() => {
        if (!props.timeLimitStarted) {
            if (props.timeLimit) {
                const mins = String(props.timeLimit).padStart(2, '0');
                setTimeLeft(`${mins}:00`);
            }
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
        <div className='mt-0.5 rounded-sm border border-border/75 bg-surface-secondary/75 px-2 pt-1 font-["Orbitron",sans-serif] font-medium text-foreground'>
            <h1 className='w-28 text-center text-[2rem] tabular-nums'>{timeLeft}</h1>
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
