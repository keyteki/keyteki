import React from 'react';
import { useTranslation } from 'react-i18next';

// Percentages and the bar are only shown once a deck has enough games for them to mean something
const MinGamesForRates = 5;

const DominantColour = 'bg-[color:color-mix(in_oklab,var(--brand)_62%,black)]';
const WinColour = 'bg-[color:var(--brand)]';
const LossColour = 'bg-foreground/15';

/**
 * @typedef DeckRecordProps
 * @property {{dominantWins: number, games: number, losses: number, wins: number}} [record] The deck's record across all players
 * @property {'compact'|'full'} [size] compact fits on one line (pending game), full adds a legend (deck page)
 * @property {string} [className]
 */

/**
 * @param {DeckRecordProps} props
 */
const DeckRecord = ({ record, size = 'compact', className = '' }) => {
    const { t } = useTranslation();

    if (!record) {
        return null;
    }

    const tooltip = t(
        'Record across all players over the last 12 months. A dominant win is one where the opponent forged no keys.'
    );
    const recordText = t('{{wins}}–{{losses}}', record);

    if (record.games < MinGamesForRates) {
        return (
            <div
                className={`flex min-w-0 items-center gap-2 text-xs text-foreground/62 dark:text-muted ${className}`}
                title={tooltip}
            >
                {record.games > 0 && (
                    <span className='font-semibold text-foreground/85'>{recordText}</span>
                )}
                <span className='rounded border border-border/50 px-1.5 leading-4'>
                    {record.games === 0 ? t('No games yet') : t('New deck')}
                </span>
            </div>
        );
    }

    const percent = (count) => (100 * count) / record.games;
    const winRate = Math.round(percent(record.wins));
    const dominantRate = Math.round(percent(record.dominantWins));
    const isFull = size === 'full';

    const bar = (
        <div
            aria-label={t(
                '{{wins}} wins including {{dominantWins}} dominant, {{losses}} losses',
                record
            )}
            className={`flex shrink-0 overflow-hidden rounded-full ${LossColour} ${
                isFull ? 'h-2 w-full max-w-72' : 'h-1.5 w-20'
            }`}
            role='img'
        >
            <div className={DominantColour} style={{ width: `${percent(record.dominantWins)}%` }} />
            <div
                className={WinColour}
                style={{ width: `${percent(record.wins - record.dominantWins)}%` }}
            />
        </div>
    );

    if (!isFull) {
        return (
            <div
                className={`flex min-w-0 items-center gap-2 text-xs text-foreground/62 dark:text-muted ${className}`}
                title={tooltip}
            >
                {bar}
                <span className='truncate'>
                    <span className='font-semibold text-foreground/85'>{recordText}</span>
                    {' · '}
                    {t('{{winRate}}% won', { winRate })}
                    {' · '}
                    {t('{{dominantWins}} dominant', record)}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex min-w-0 flex-col gap-1.5 ${className}`} title={tooltip}>
            {bar}
            <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm'>
                <span className='font-semibold text-foreground'>{recordText}</span>
                <span className='text-foreground/80'>{t('{{winRate}}% won', { winRate })}</span>
                <span className='inline-flex items-center gap-1 text-foreground/80'>
                    <span className={`inline-block h-2 w-2 rounded-full ${DominantColour}`} />
                    {t('{{dominantWins}} dominant wins ({{dominantRate}}% of games)', {
                        ...record,
                        dominantRate
                    })}
                </span>
            </div>
        </div>
    );
};

export default DeckRecord;
