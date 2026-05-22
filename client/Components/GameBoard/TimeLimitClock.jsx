import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) {
        return '00:00';
    }

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimeLimitClock = (props) => {
    const [timeLeft, setTimeLeft] = useState(() => {
        if (props.timeLimit) {
            return formatTime(props.timeLimit * 60);
        }
        return undefined;
    });

    useEffect(() => {
        if (props.paused) {
            return;
        }

        if (!props.timeLimitStarted) {
            if (props.timeLimitStartedAt) {
                // Timer expired
                setTimeLeft('00:00');
            } else if (props.timeLimit) {
                // Not started yet
                setTimeLeft(formatTime(props.timeLimit * 60));
            }
            return;
        }

        const tick = () => {
            const endTime = moment(props.timeLimitStartedAt).add(props.timeLimit, 'minutes');
            const remaining = Math.max(0, Math.floor(endTime.diff(moment()) / 1000));
            setTimeLeft(formatTime(remaining));
        };

        tick();
        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, [props.timeLimit, props.timeLimitStarted, props.timeLimitStartedAt, props.paused]);

    return (
        <div className='px-1 pb-1'>
            <div className='w-full rounded-xl border border-border/75 bg-surface-secondary/75 p-2 text-center font-["Orbitron",sans-serif] font-medium'>
                <h1 className='text-[2rem] tabular-nums'>{timeLeft}</h1>
            </div>
        </div>
    );
};

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    paused: PropTypes.bool,
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
