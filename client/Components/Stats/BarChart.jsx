import React, { useState } from 'react';

/**
 * @typedef Bar
 * @property {string} key
 * @property {number} value
 * @property {string} label Shown under the bar if axisLabel is set, and in the readout
 * @property {boolean} [axisLabel] Whether to label this bar on the axis
 */

/**
 * @typedef BarChartProps
 * @property {string} title
 * @property {Bar[]} bars
 * @property {(bar: Bar) => string} describe The readout for a bar, e.g. "12 Oct: 3 games"
 * @property {string} [summary] The readout when no bar is hovered
 */

/**
 * A single-series column chart. Hovering, focusing or tapping a column shows its value in the readout.
 * @param {BarChartProps} props
 */
const BarChart = ({ title, bars, describe, summary }) => {
    const [active, setActive] = useState(null);
    const max = Math.max(1, ...bars.map((bar) => bar.value));
    const activeBar = bars.find((bar) => bar.key === active);

    return (
        <figure className='flex min-w-0 flex-col gap-1'>
            <figcaption className='flex flex-wrap items-baseline justify-between gap-x-3 text-sm'>
                <span className='font-semibold text-foreground'>{title}</span>
                <span className='text-xs text-foreground/62 tabular-nums dark:text-muted'>
                    {activeBar ? describe(activeBar) : summary}
                </span>
            </figcaption>
            <div
                className='flex h-28 items-end gap-[2px] border-b border-border/60'
                onMouseLeave={() => setActive(null)}
            >
                {bars.map((bar) => (
                    <button
                        key={bar.key}
                        type='button'
                        aria-label={describe(bar)}
                        className='group flex h-full min-w-0 flex-1 cursor-default items-end focus:outline-none'
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(bar.key)}
                        onFocus={() => setActive(bar.key)}
                        onMouseEnter={() => setActive(bar.key)}
                    >
                        <span
                            className={`block w-full rounded-t-[4px] bg-[color:var(--brand)] transition-opacity ${
                                active && active !== bar.key ? 'opacity-45' : ''
                            } group-focus-visible:ring-2 group-focus-visible:ring-foreground/40`}
                            style={{
                                height: bar.value > 0 ? `max(2px, ${(100 * bar.value) / max}%)` : 0
                            }}
                        />
                    </button>
                ))}
            </div>
            <div className='flex gap-[2px] text-[10px] leading-3 text-foreground/62 dark:text-muted'>
                {bars.map((bar) => (
                    <span
                        key={bar.key}
                        className='min-w-0 flex-1 overflow-visible whitespace-nowrap text-center'
                    >
                        {bar.axisLabel ? bar.label : ''}
                    </span>
                ))}
            </div>
        </figure>
    );
};

export default BarChart;
