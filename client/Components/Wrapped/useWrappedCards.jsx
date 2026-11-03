import React from 'react';

import { Constants } from '../../constants';
import Logo from '../../assets/img/main_header_logo.png';
import useStatsFormat from '../Stats/useStatsFormat';
import { localHours } from './localHours';

// Ranks are only worth boasting about in the top half
const MaxRankShown = 50;

// Same threshold as the stats page and deck records
const MinGamesForRates = 5;

// Times of day, in the viewer's local hours
const TimesOfDay = [
    {
        from: 0,
        to: 5,
        name: 'Night owl',
        description: 'Most of your games started after midnight.'
    },
    {
        from: 5,
        to: 12,
        name: 'Early bird',
        description: 'You did most of your forging before noon.'
    },
    {
        from: 12,
        to: 18,
        name: 'Afternoon forger',
        description: 'Most of your games were in the afternoon.'
    },
    {
        from: 18,
        to: 24,
        name: 'Evening regular',
        description: 'The evening is when you sit down to play.'
    }
];

/**
 * Small heading at the top of a card
 * @param {{children: import('react').ReactNode}} props
 */
export const Kicker = ({ children }) => (
    <div className='text-[4.2cqw] font-semibold uppercase tracking-[0.18em] text-white/75'>
        {children}
    </div>
);

/**
 * A very large display number or name
 * @param {{children: import('react').ReactNode, size?: string}} props
 */
export const Big = ({ children, size = 'text-[24cqw]' }) => (
    <div className={`font-[Bombardier] leading-[0.95] text-white ${size}`}>{children}</div>
);

/**
 * @param {{children: import('react').ReactNode, className?: string}} props
 */
export const Body = ({ children, className = '' }) => (
    <p className={`m-0 text-[5cqw] leading-snug text-white/90 ${className}`}>{children}</p>
);

/**
 * A pill for ranks and notes
 * @param {{children: import('react').ReactNode}} props
 */
export const Pill = ({ children }) => (
    <span className='inline-block w-fit rounded-full bg-black/30 px-[3.5cqw] py-[1.4cqw] text-[3.8cqw] font-semibold text-white'>
        {children}
    </span>
);

/**
 * A label and value in the card's grid of facts
 * @param {{label: string, value: import('react').ReactNode}} props
 */
export const Fact = ({ label, value }) => (
    <div className='flex min-w-0 flex-col'>
        <span className='text-[3.6cqw] uppercase tracking-wider text-white/65'>{label}</span>
        <span className='truncate text-[7cqw] font-semibold leading-tight text-white'>{value}</span>
    </div>
);

/**
 * @typedef StoryCard
 * @property {string} key
 * @property {string} background Classes for the card's background
 * @property {boolean} [detailed] Whether the card uses in-game stats, which only exist for part of the year
 * @property {import('react').ReactNode} content
 */

/**
 * Builds the story's cards from a Wrapped snapshot, leaving out any there isn't enough data for
 * @param {object} wrapped The snapshot from WrappedService
 * @param {string} username
 * @returns {StoryCard[]}
 */
const useWrappedCards = (wrapped, username) => {
    const { t, locale, number, plural, houseLabel, cardName, formatDay } = useStatsFormat();
    const rank = (top, text) =>
        top && top <= MaxRankShown ? <Pill>{t(text, { rank: top })}</Pill> : null;

    // The snapshot's end is exclusive
    const lastDay = new Date(Date.parse(`${wrapped.to}T00:00:00Z`) - 86400000)
        .toISOString()
        .slice(0, 10);
    const period = `${formatDay(wrapped.from, { day: 'numeric', month: 'long' })} – ${formatDay(
        lastDay,
        { day: 'numeric', month: 'long' }
    )}`;

    const detailed = wrapped.detailed;
    const detailedFrom = wrapped.site?.detailedFrom;
    const detailedNote =
        detailed && detailedFrom && detailedFrom > wrapped.from
            ? t('Since {{day}}', {
                  day: formatDay(detailedFrom, { day: 'numeric', month: 'long' })
              })
            : null;

    const hours = wrapped.seconds / 3600;
    const busiestMonth = wrapped.byMonth.indexOf(Math.max(...wrapped.byMonth));
    const monthName = (month, style = 'long') =>
        new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: style }).format(
            new Date(Date.UTC(wrapped.year, month, 1))
        );
    const maxMonth = Math.max(1, ...wrapped.byMonth);

    // Start times are stored in UTC; show the time of day in the viewer's own time
    const hoursOfPlay = localHours(wrapped.startTimes, wrapped.year);
    const peakHour = hoursOfPlay.indexOf(Math.max(...hoursOfPlay));
    const timeOfDay = TimesOfDay.map((time) => ({
        ...time,
        games: hoursOfPlay.slice(time.from, time.to).reduce((total, count) => total + count, 0)
    })).sort((a, b) => b.games - a.games)[0];
    const formatHour = (hour) =>
        new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: 'UTC' }).format(
            new Date(Date.UTC(2024, 0, 1, hour))
        );

    const winRate = Math.round((100 * wrapped.wins) / wrapped.games);
    const topDeck = wrapped.topDeck;
    const favourite = wrapped.favouriteHouse;
    const mvp = detailed?.mvp;
    // Served from this site by card id, so it can be drawn into the share image (Master Vault's can't)
    const mvpImage = mvp ? `/img/cards/${mvp.id}.png` : null;

    /** @type {StoryCard[]} */
    const story = [];

    story.push({
        key: 'intro',
        background: 'bg-[radial-gradient(circle_at_50%_35%,#6b4d0f_0%,#24190a_45%,#0b0906_100%)]',
        content: (
            <div className='flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                <img alt={t('The Crucible Online')} className='w-[72cqw]' src={Logo} />
                <Big size='text-[30cqw] text-[color:#f0c44d]'>{wrapped.year}</Big>
                <Big size='text-[12cqw]'>{t('Wrapped')}</Big>
                <Body>{t('{{username}}, here is your year at the Crucible.', { username })}</Body>
                <Pill>{period}</Pill>
            </div>
        )
    });

    story.push({
        key: 'games',
        background: 'bg-gradient-to-br from-[#3b1d8f] via-[#4c1d95] to-[#1e1b4b]',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>{t('You played')}</Kicker>
                <Big>{number(wrapped.games)}</Big>
                <Body>
                    {plural(
                        Math.round(hours),
                        'games, about an hour at the table.',
                        'games, about {{count}} hours at the table.'
                    )}
                </Body>
                {rank(wrapped.ranks?.games, 'Top {{rank}}% of players for games played')}
                <div className='mt-[4cqw] flex h-[28cqw] items-end gap-[1.2cqw]'>
                    {wrapped.byMonth.map((count, month) => (
                        <div key={month} className='flex h-full flex-1 flex-col justify-end'>
                            <div
                                className={`rounded-t-[1cqw] ${
                                    month === busiestMonth ? 'bg-[#f0c44d]' : 'bg-white/45'
                                }`}
                                style={{ height: count > 0 ? `${(100 * count) / maxMonth}%` : 0 }}
                            />
                            <div className='pt-[1cqw] text-center text-[3cqw] text-white/70'>
                                {monthName(month, 'narrow')}
                            </div>
                        </div>
                    ))}
                </div>
                <Body className='text-[4.2cqw]'>
                    {t('{{month}} was your busiest month.', { month: monthName(busiestMonth) })}
                </Body>
            </div>
        )
    });

    story.push({
        key: 'record',
        background: 'bg-gradient-to-br from-[#065f46] via-[#047857] to-[#022c22]',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>{t('Your record')}</Kicker>
                <Big>{number(wrapped.wins)}</Big>
                <Body>
                    {plural(wrapped.wins, 'win', 'wins')}
                    {' · '}
                    {plural(wrapped.losses, '1 loss', '{{count}} losses')}
                </Body>
                {wrapped.games >= MinGamesForRates && (
                    <Big size='text-[12cqw]'>{t('{{rate}}% won', { rate: winRate })}</Big>
                )}
                <div className='flex flex-col gap-[2cqw]'>
                    {rank(wrapped.ranks?.wins, 'Top {{rank}}% of players for wins')}
                    {rank(wrapped.ranks?.winRate, 'Top {{rank}}% of players for win rate')}
                </div>
            </div>
        )
    });

    if (wrapped.dominantWins > 0 || wrapped.longestWinStreak > 1 || wrapped.fastestWin) {
        story.push({
            key: 'highlights',
            background: 'bg-gradient-to-br from-[#9f1239] via-[#be123c] to-[#431407]',
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>{t('Your best moments')}</Kicker>
                    {wrapped.dominantWins > 0 && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Big size='text-[20cqw]'>{number(wrapped.dominantWins)}</Big>
                            <Body>
                                {plural(
                                    wrapped.dominantWins,
                                    "dominant win, where your opponent didn't forge a single key.",
                                    "dominant wins, where your opponent didn't forge a single key."
                                )}
                            </Body>
                            {rank(wrapped.ranks?.dominantWins, 'Top {{rank}}% of players')}
                        </div>
                    )}
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        {wrapped.longestWinStreak > 1 && (
                            <Fact
                                label={t('Win streak')}
                                value={t('{{count}} in a row', {
                                    count: wrapped.longestWinStreak
                                })}
                            />
                        )}
                        {wrapped.fastestWin && (
                            <Fact
                                label={t('Fastest win')}
                                value={t('{{count}} turns', { count: wrapped.fastestWin.turns })}
                            />
                        )}
                    </div>
                </div>
            )
        });
    }

    if (topDeck) {
        story.push({
            key: 'deck',
            background: 'bg-gradient-to-b from-[#0f172a] via-[#1e3a5f] to-[#0c4a6e]',
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>{t('Your deck of the year')}</Kicker>
                    {topDeck.houses.length > 0 && (
                        <div className='flex gap-[3cqw]'>
                            {topDeck.houses.map((house) => (
                                <img
                                    key={house}
                                    alt={houseLabel(house)}
                                    className='w-[17cqw]'
                                    src={Constants.HouseIconPaths[house]}
                                />
                            ))}
                        </div>
                    )}
                    <Big size='text-[10cqw]'>{topDeck.name || t('A deck since deleted')}</Big>
                    <div className='grid grid-cols-3 gap-[3cqw]'>
                        <Fact label={t('Games')} value={number(topDeck.games)} />
                        <Fact
                            label={t('Record')}
                            value={t('{{wins}}–{{losses}}', {
                                wins: topDeck.wins,
                                losses: topDeck.games - topDeck.wins
                            })}
                        />
                        <Fact label={t('Dominant')} value={number(topDeck.dominantWins)} />
                    </div>
                    {wrapped.deckCount > 1 && (
                        <Body className='text-[4.2cqw]'>
                            {t('One of {{count}} decks you played this year.', {
                                count: wrapped.deckCount
                            })}
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (favourite) {
        story.push({
            key: 'house',
            background: 'bg-[#120d08]',
            detailed: favourite.source === 'chosen',
            content: (
                <>
                    {Constants.HouseBgPaths[favourite.house] && (
                        <img
                            alt=''
                            className='absolute inset-0 h-full w-full object-cover opacity-35'
                            src={Constants.HouseBgPaths[favourite.house]}
                        />
                    )}
                    <div className='relative flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                        <Kicker>{t('Your house')}</Kicker>
                        <img
                            alt=''
                            className='w-[45cqw] drop-shadow-[0_2cqw_6cqw_rgba(0,0,0,0.6)]'
                            src={Constants.HouseIconPaths[favourite.house]}
                        />
                        <Big size='text-[15cqw]'>{houseLabel(favourite.house)}</Big>
                        <Body>
                            {favourite.source === 'chosen'
                                ? t('You chose {{house}} {{count}} times.', {
                                      house: houseLabel(favourite.house),
                                      count: favourite.count
                                  })
                                : t('{{house}} was in your deck for {{count}} games.', {
                                      house: houseLabel(favourite.house),
                                      count: favourite.count
                                  })}
                        </Body>
                        {wrapped.site?.topHouse && wrapped.site.topHouse === favourite.house && (
                            <Pill>{t('The most chosen house on the Crucible, too')}</Pill>
                        )}
                    </div>
                </>
            )
        });
    }

    if (mvp) {
        story.push({
            key: 'mvp',
            background: 'bg-gradient-to-b from-[#1c1917] to-[#44403c]',
            detailed: true,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>{t('Your MVP')}</Kicker>
                    {mvpImage && (
                        <img
                            alt={cardName(mvp.id)}
                            className='w-[56cqw] rounded-[3cqw] shadow-[0_3cqw_10cqw_rgba(0,0,0,0.6)]'
                            src={mvpImage}
                        />
                    )}
                    <Big size='text-[10cqw]'>{cardName(mvp.id)}</Big>
                    <Body>
                        {t('Reaped {{reaps}} times and fought {{fights}} times.', {
                            reaps: number(mvp.reaps),
                            fights: number(mvp.fights)
                        })}
                    </Body>
                </div>
            )
        });
    }

    if (detailed) {
        story.push({
            key: 'amber',
            background: 'bg-gradient-to-br from-[#b45309] via-[#c2410c] to-[#431407]',
            detailed: true,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>{t('Æmber')}</Kicker>
                    <Big>{number(detailed.amberGained)}</Big>
                    <Body>
                        {t('æmber gained, and {{keys}} keys forged.', {
                            keys: number(wrapped.keysForged)
                        })}
                    </Body>
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        <Fact label={t('Stolen')} value={number(detailed.amberStolen)} />
                        <Fact label={t('Captured')} value={number(detailed.amberCaptured)} />
                        <Fact
                            label={t('Creatures destroyed')}
                            value={number(detailed.enemyCreaturesDestroyed)}
                        />
                        <Fact label={t('Damage dealt')} value={number(detailed.damageDealt)} />
                    </div>
                </div>
            )
        });
    }

    if (wrapped.rival) {
        story.push({
            key: 'opponents',
            background: 'bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a]',
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>{t('Your rival')}</Kicker>
                    <div className='flex flex-col gap-[2cqw]'>
                        <Big size='text-[13cqw] break-words'>{wrapped.rival.name}</Big>
                        <Body>
                            {t('{{count}} games together. You won {{wins}}.', {
                                count: wrapped.rival.games,
                                wins: wrapped.rival.wins
                            })}
                        </Body>
                    </div>
                    {wrapped.nemesis && wrapped.nemesis.name !== wrapped.rival.name && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Kicker>{t('Your nemesis')}</Kicker>
                            <Big size='text-[10cqw] break-words'>{wrapped.nemesis.name}</Big>
                            <Body>
                                {plural(
                                    wrapped.nemesis.games - wrapped.nemesis.wins,
                                    'Beat you once.',
                                    'Beat you {{count}} times.'
                                )}
                            </Body>
                        </div>
                    )}
                    <Body className='text-[4.2cqw]'>
                        {plural(
                            wrapped.opponentCount,
                            'You played one opponent this year.',
                            'You played {{count}} different opponents this year.'
                        )}
                    </Body>
                </div>
            )
        });
    }

    story.push({
        key: 'time',
        background:
            timeOfDay.from === 0
                ? 'bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#312e81]'
                : timeOfDay.from === 5
                ? 'bg-gradient-to-b from-[#fb923c] via-[#db2777] to-[#4c1d95]'
                : timeOfDay.from === 12
                ? 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#1e3a8a]'
                : 'bg-gradient-to-b from-[#7c2d12] via-[#581c87] to-[#0f172a]',
        content: (
            <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                <Kicker>{t('When you play')}</Kicker>
                <Big size='text-[15cqw]'>{t(timeOfDay.name)}</Big>
                <Body>{t(timeOfDay.description)}</Body>
                <div className='grid grid-cols-2 gap-[4cqw]'>
                    <Fact label={t('Peak hour')} value={formatHour(peakHour)} />
                    <Fact label={t('Busiest month')} value={monthName(busiestMonth)} />
                </div>
            </div>
        )
    });

    story.push({
        key: 'summary',
        background: 'bg-[radial-gradient(circle_at_50%_0%,#4a360b_0%,#16110a_55%,#0b0906_100%)]',
        content: (
            <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                <div className='flex flex-col gap-[1cqw]'>
                    <Kicker>{t('{{year}} Wrapped', { year: wrapped.year })}</Kicker>
                    <Big size='text-[11cqw] break-words'>{username}</Big>
                </div>
                <div className='grid grid-cols-2 gap-x-[4cqw] gap-y-[5cqw]'>
                    <Fact label={t('Games')} value={number(wrapped.games)} />
                    <Fact
                        label={t('Record')}
                        value={t('{{wins}}–{{losses}}', {
                            wins: wrapped.wins,
                            losses: wrapped.losses
                        })}
                    />
                    <Fact label={t('Dominant wins')} value={number(wrapped.dominantWins)} />
                    <Fact label={t('Hours played')} value={number(hours)} />
                    {favourite && <Fact label={t('House')} value={houseLabel(favourite.house)} />}
                    {mvp && <Fact label={t('MVP')} value={cardName(mvp.id)} />}
                </div>
                {topDeck?.name && (
                    <div className='flex flex-col'>
                        <span className='text-[3.6cqw] uppercase tracking-wider text-white/65'>
                            {t('Deck of the year')}
                        </span>
                        <span className='text-[5.5cqw] font-semibold leading-tight text-white'>
                            {topDeck.name}
                        </span>
                    </div>
                )}
                <Pill>{t(timeOfDay.name)}</Pill>
            </div>
        )
    });

    return story.map((card) => ({
        ...card,
        note: card.detailed ? detailedNote : null
    }));
};

export default useWrappedCards;
