import React from 'react';

import { Constants } from '../../constants';
import BarChart from './BarChart';
import StatTile from './StatTile';
import useStatsFormat from './useStatsFormat';

// Same threshold as deck records: rates over fewer games don't mean much
const MinGamesForRates = 5;

const Weekdays = [1, 2, 3, 4, 5, 6, 7];

/**
 * @param {{title: string, children: import('react').ReactNode, note?: string}} props
 */
const Section = ({ title, note, children }) => (
    <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-baseline justify-between gap-x-3 border-b border-border/50 pb-1'>
            <h2 className='text-base font-semibold text-[color:var(--heading)]'>{title}</h2>
            {note && <span className='text-xs text-foreground/62 dark:text-muted'>{note}</span>}
        </div>
        {children}
    </section>
);

const TileGrid = ({ children }) => (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>{children}</div>
);

/**
 * @typedef MonthlyStatsProps
 * @property {string} month YYYY-MM
 * @property {object} stats The summary from UserStatsService
 */

/**
 * @param {MonthlyStatsProps} props
 */
const MonthlyStats = ({ month, stats }) => {
    const { t, number, plural, houseLabel, cardName, formatDay } = useStatsFormat();

    const percent = (count, total) => Math.round((100 * count) / total);
    const record = (wins, games) => t('{{wins}}–{{losses}}', { wins, losses: games - wins });
    const rate = (wins, games) =>
        games >= MinGamesForRates ? t('{{rate}}% won', { rate: percent(wins, games) }) : '';
    const weekdayName = (isoDay) =>
        // 2024-01-01 was a Monday
        formatDay(`2024-01-0${isoDay}`, { weekday: 'short' });

    const gamesText = (count) => plural(count, '1 game', '{{count}} games');

    if (stats.games === 0) {
        return <p className='py-6 text-center text-foreground/80'>{t('No games this month.')}</p>;
    }

    const [year, monthNumber] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const dayBars = Array.from({ length: daysInMonth }, (_, index) => {
        const day = `${month}-${String(index + 1).padStart(2, '0')}`;
        return {
            key: day,
            value: stats.byDay[day] || 0,
            label: String(index + 1),
            axisLabel: index === 0 || (index + 1) % 7 === 0
        };
    });
    const busiestDay = dayBars.reduce((best, bar) => (bar.value > best.value ? bar : best));

    const weekdayBars = Weekdays.map((isoDay) => ({
        key: String(isoDay),
        value: stats.byWeekday[isoDay - 1],
        label: weekdayName(isoDay),
        axisLabel: true
    }));

    const hourBars = stats.byHour.map((value, hour) => ({
        key: String(hour),
        value,
        label: String(hour).padStart(2, '0'),
        axisLabel: hour % 6 === 0
    }));

    const hours = stats.seconds / 3600;
    const detailed = stats.detailed;
    const houses = detailed
        ? Object.entries(detailed.houses).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        : [];
    const houseTotal = houses.reduce((total, [, count]) => total + count, 0);

    return (
        <div className='flex flex-col gap-6'>
            <TileGrid>
                <StatTile
                    label={t('Games')}
                    value={number(stats.games)}
                    detail={t('{{hours}} hours played', {
                        hours: hours < 10 ? hours.toFixed(1) : number(hours)
                    })}
                />
                <StatTile
                    label={t('Record')}
                    value={record(stats.wins, stats.games)}
                    detail={rate(stats.wins, stats.games)}
                />
                <StatTile
                    label={t('Dominant wins')}
                    value={number(stats.dominantWins)}
                    detail={
                        stats.games >= MinGamesForRates
                            ? t('{{rate}}% of games', {
                                  rate: percent(stats.dominantWins, stats.games)
                              })
                            : ''
                    }
                />
                <StatTile label={t('Longest win streak')} value={number(stats.longestWinStreak)} />
                <StatTile label={t('Keys forged')} value={number(stats.keysForged)} />
                <StatTile
                    label={t('Average turns')}
                    value={(stats.turns / stats.games).toFixed(1)}
                    detail={t('per game')}
                />
            </TileGrid>

            <Section title={t('When you played')} note={t('Times are UTC')}>
                <BarChart
                    title={t('Games per day')}
                    bars={dayBars}
                    describe={(bar) =>
                        `${formatDay(bar.key, { day: 'numeric', month: 'short' })}: ${gamesText(
                            bar.value
                        )}`
                    }
                    summary={t('Busiest: {{day}} ({{games}})', {
                        day: formatDay(busiestDay.key, { day: 'numeric', month: 'short' }),
                        games: gamesText(busiestDay.value)
                    })}
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <BarChart
                        title={t('By day of the week')}
                        bars={weekdayBars}
                        describe={(bar) => `${bar.label}: ${gamesText(bar.value)}`}
                    />
                    <BarChart
                        title={t('By hour')}
                        bars={hourBars}
                        describe={(bar) => `${bar.label}:00: ${gamesText(bar.value)}`}
                    />
                </div>
            </Section>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <Section
                    title={t('Decks')}
                    note={
                        stats.deckCount > stats.decks.length
                            ? t('Top {{shown}} of {{count}}', {
                                  shown: stats.decks.length,
                                  count: stats.deckCount
                              })
                            : undefined
                    }
                >
                    <table className='w-full table-fixed text-sm'>
                        <thead className='text-left text-xs text-foreground/62 dark:text-muted'>
                            <tr>
                                <th className='pb-1 font-normal'>{t('Deck')}</th>
                                <th className='w-16 pb-1 text-right font-normal'>{t('Games')}</th>
                                <th className='w-16 pb-1 text-right font-normal'>{t('Record')}</th>
                                <th className='w-16 pb-1 text-right font-normal'>
                                    {t('Dominant')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className='tabular-nums'>
                            {stats.decks.map((deck) => (
                                <tr
                                    key={deck.uuid || deck.name}
                                    className='border-t border-border/30'
                                >
                                    <td className='max-w-0 truncate py-1 pr-2' title={deck.name}>
                                        {deck.name || t('Deleted deck')}
                                    </td>
                                    <td className='py-1 text-right'>{deck.games}</td>
                                    <td className='py-1 text-right'>
                                        {record(deck.wins, deck.games)}
                                    </td>
                                    <td className='py-1 text-right'>{deck.dominantWins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>

                <Section title={t('Opponents')}>
                    <div className='grid grid-cols-2 gap-2'>
                        <StatTile
                            label={t('Most played')}
                            value={stats.rival ? stats.rival.name : '—'}
                            detail={
                                stats.rival &&
                                `${gamesText(stats.rival.games)} · ${record(
                                    stats.rival.wins,
                                    stats.rival.games
                                )}`
                            }
                        />
                        <StatTile
                            label={t('Nemesis')}
                            value={stats.nemesis ? stats.nemesis.name : '—'}
                            detail={
                                stats.nemesis
                                    ? plural(
                                          stats.nemesis.games - stats.nemesis.wins,
                                          'Beat you once',
                                          'Beat you {{count}} times'
                                      )
                                    : t('Nobody beat you')
                            }
                        />
                    </div>
                    <p className='text-sm text-foreground/80'>
                        {plural(
                            stats.opponentCount,
                            'You played one opponent.',
                            'You played {{count}} different opponents.'
                        )}
                        {stats.fastestWin &&
                            ' ' +
                                t('Your fastest win took {{turns}} turns, on {{day}}.', {
                                    turns: stats.fastestWin.turns,
                                    day: formatDay(stats.fastestWin.day, {
                                        day: 'numeric',
                                        month: 'long'
                                    })
                                })}
                        {stats.concededByOpponent > 0 &&
                            ' ' +
                                plural(
                                    stats.concededByOpponent,
                                    'Opponents conceded 1 game to you.',
                                    'Opponents conceded {{count}} games to you.'
                                )}
                    </p>
                </Section>
            </div>

            {detailed && (
                <Section
                    title={t('In the game')}
                    note={
                        detailed.games < stats.games
                            ? t('From {{count}} of your {{games}} games', {
                                  count: detailed.games,
                                  games: stats.games
                              })
                            : undefined
                    }
                >
                    <TileGrid>
                        <StatTile
                            label={t('Æmber gained')}
                            value={number(detailed.amberGained)}
                            detail={t('{{amber}} from reaping', {
                                amber: number(detailed.amberFromReaping)
                            })}
                        />
                        <StatTile label={t('Æmber stolen')} value={number(detailed.amberStolen)} />
                        <StatTile
                            label={t('Æmber captured')}
                            value={number(detailed.amberCaptured)}
                        />
                        <StatTile
                            label={t('Creatures destroyed')}
                            value={number(detailed.enemyCreaturesDestroyed)}
                            detail={t('{{count}} of yours lost', { count: detailed.creaturesLost })}
                        />
                        <StatTile label={t('Damage dealt')} value={number(detailed.damageDealt)} />
                        <StatTile
                            label={t('Cards played')}
                            value={number(detailed.cardsPlayed)}
                            detail={t('{{count}} drawn', { count: detailed.cardsDrawn })}
                        />
                    </TileGrid>

                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <div className='flex flex-col gap-2'>
                            <h3 className='!m-0 !text-sm font-semibold'>{t('Houses chosen')}</h3>
                            {houses.map(([house, count]) => (
                                <div key={house} className='flex items-center gap-2 text-sm'>
                                    {Constants.HouseIconPaths[house] && (
                                        <img
                                            className='w-6'
                                            src={Constants.HouseIconPaths[house]}
                                            alt=''
                                        />
                                    )}
                                    <span className='w-24 shrink-0 truncate'>
                                        {houseLabel(house)}
                                    </span>
                                    <span className='h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/10'>
                                        <span
                                            className='block h-full rounded-full bg-[color:var(--brand)]'
                                            style={{ width: `${(100 * count) / houses[0][1]}%` }}
                                        />
                                    </span>
                                    <span className='w-28 shrink-0 whitespace-nowrap text-right tabular-nums text-foreground/80'>
                                        {t('{{count}} turns', { count })} ·{' '}
                                        {percent(count, houseTotal)}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h3 className='!m-0 !text-sm font-semibold'>
                                {t('Most played cards')}
                            </h3>
                            {detailed.mvp && (
                                <p className='text-sm text-foreground/80'>
                                    {t(
                                        'MVP: {{card}} reaped {{reaps}} and fought {{fights}} times',
                                        {
                                            card: cardName(detailed.mvp.id),
                                            reaps: detailed.mvp.reaps,
                                            fights: detailed.mvp.fights
                                        }
                                    )}
                                </p>
                            )}
                            <table className='w-full table-fixed text-sm'>
                                <thead className='text-left text-xs text-foreground/62 dark:text-muted'>
                                    <tr>
                                        <th className='pb-1 font-normal'>{t('Card')}</th>
                                        <th className='w-16 pb-1 text-right font-normal'>
                                            {t('Played')}
                                        </th>
                                        <th className='w-16 pb-1 text-right font-normal'>
                                            {t('Reaps')}
                                        </th>
                                        <th className='w-16 pb-1 text-right font-normal'>
                                            {t('Fights')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='tabular-nums'>
                                    {detailed.cards.map((card) => (
                                        <tr key={card.id} className='border-t border-border/30'>
                                            <td className='max-w-0 truncate py-1 pr-2'>
                                                {cardName(card.id)}
                                            </td>
                                            <td className='py-1 text-right'>{card.played}</td>
                                            <td className='py-1 text-right'>{card.reaps}</td>
                                            <td className='py-1 text-right'>{card.fights}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default MonthlyStats;
