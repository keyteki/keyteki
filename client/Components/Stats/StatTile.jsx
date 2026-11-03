import React from 'react';

/**
 * @typedef StatTileProps
 * @property {string} label
 * @property {import('react').ReactNode} value
 * @property {import('react').ReactNode} [detail] A short line of context under the value
 */

/**
 * @param {StatTileProps} props
 */
const StatTile = ({ label, value, detail }) => {
    return (
        <div className='flex min-w-0 flex-col gap-0.5 rounded-md border border-border/50 bg-background/40 px-3 py-2'>
            <span className='text-xs text-foreground/62 dark:text-muted'>{label}</span>
            <span className='text-2xl font-semibold leading-tight text-foreground tabular-nums'>
                {value}
            </span>
            {detail && (
                <span className='truncate text-xs text-foreground/62 dark:text-muted'>
                    {detail}
                </span>
            )}
        </div>
    );
};

export default StatTile;
