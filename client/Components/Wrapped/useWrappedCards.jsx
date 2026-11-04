import React, { useMemo } from 'react';

import { Constants } from '../../constants';
import CardBackImage from '../Decks/CardBackImage';
import Logo from '../../assets/img/main_header_logo.png';
import AmberIcon from '../../assets/img/amber.png';
import KeyYellow from '../../assets/img/forgedkeyyellow.png';
import KeyRed from '../../assets/img/forgedkeyred.png';
import KeyBlue from '../../assets/img/forgedkeyblue.png';
import useStatsFormat from '../Stats/useStatsFormat';
import { localHours } from './localHours';

// Ranks are only worth boasting about in the top half
const MaxRankShown = 50;

// Same threshold as the stats page and deck records
const MinGamesForRates = 5;

// How many sets are listed on the sets card
const MaxSetsShown = 4;

// Times of day, in the viewer's local hours, each with the house that suits it
const TimesOfDay = [
    {
        from: 0,
        to: 5,
        house: 'shadows',
        name: 'Shadows by night',
        description: 'You strike after dark. Most of your games started after midnight.'
    },
    {
        from: 5,
        to: 12,
        house: 'sanctum',
        name: 'Dawn vigil',
        description: 'Like Sanctum at prayer, you did most of your forging before noon.'
    },
    {
        from: 12,
        to: 18,
        house: 'brobnar',
        name: 'Midday brawler',
        description: 'Most of your games were in the afternoon, when Brobnar is loudest.'
    },
    {
        from: 18,
        to: 24,
        house: 'dis',
        name: 'Evening torment',
        description: 'The evening is when you sit down to torment your opponents.'
    }
];

// The Crucible's colours: dark stone lit by æmber, tinted for each card
const Backgrounds = {
    intro: 'bg-[radial-gradient(circle_at_50%_35%,#6b4d0f_0%,#24190a_45%,#0b0906_100%)]',
    games: 'bg-[radial-gradient(circle_at_50%_0%,#4d3510_0%,#1a130a_55%,#0b0906_100%)]',
    record: 'bg-[radial-gradient(circle_at_50%_15%,#4a4212_0%,#1a170b_55%,#0b0906_100%)]',
    highlights: 'bg-[radial-gradient(circle_at_30%_10%,#6b1d12_0%,#2a0f0a_50%,#0b0906_100%)]',
    deck: 'bg-[radial-gradient(circle_at_50%_38%,#5a4214_0%,#1f170c_50%,#0b0906_100%)]',
    sets: 'bg-[radial-gradient(circle_at_50%_20%,#23404a_0%,#0f1b1f_55%,#0b0906_100%)]',
    mvp: 'bg-[radial-gradient(circle_at_50%_40%,#3a3328_0%,#16130f_60%,#0b0906_100%)]',
    amber: 'bg-[radial-gradient(circle_at_50%_25%,#8a520c_0%,#3a2108_45%,#0b0906_100%)]',
    opponents: 'bg-[linear-gradient(160deg,#5a1616_0%,#1a0e0c_45%,#0d1626_70%,#163a66_100%)]',
    house: 'bg-[#120d08]',
    summary: 'bg-[radial-gradient(circle_at_50%_0%,#4a360b_0%,#16110a_55%,#0b0906_100%)]'
};

/**
 * Small heading at the top of a card
 * @param {{children: import('react').ReactNode}} props
 */
export const Kicker = ({ children }) => (
    <div className='text-[4.2cqw] font-semibold uppercase tracking-[0.18em] text-[#e9d9b0]/80'>
        {children}
    </div>
);

/**
 * A very large display number or name
 * @param {{children: import('react').ReactNode, size?: string, color?: string}} props
 */
export const Big = ({ children, size = 'text-[24cqw]', color = 'text-white' }) => (
    <div className={`font-[Bombardier] leading-[0.95] ${color} ${size}`}>{children}</div>
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
    <span className='inline-block w-fit rounded-full border border-[#f0c44d]/30 bg-black/35 px-[3.5cqw] py-[1.4cqw] text-[3.8cqw] font-semibold text-white'>
        {children}
    </span>
);

/**
 * A label and value in the card's grid of facts
 * @param {{label: string, value: import('react').ReactNode}} props
 */
export const Fact = ({ label, value }) => (
    <div className='flex min-w-0 flex-col'>
        <span className='text-[3.6cqw] uppercase tracking-wider text-[#e9d9b0]/65'>{label}</span>
        <span className='truncate text-[7cqw] font-semibold leading-tight text-white'>{value}</span>
    </div>
);

/**
 * A house's background art behind a card's content
 * @param {{house: string|null}} props
 */
const HouseBackdrop = ({ house }) =>
    house && Constants.HouseBgPaths[house] ? (
        <img
            alt=''
            className='absolute inset-0 h-full w-full object-cover opacity-35'
            src={Constants.HouseBgPaths[house]}
        />
    ) : null;

/**
 * A gold rule between parts of the summary card
 */
const Rule = () => (
    <div className='h-[0.4cqw] w-full bg-gradient-to-r from-transparent via-[#f0c44d]/70 to-transparent' />
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
    // Worked out by the server, so the email can use it too
    // The server picks the title (so the email can use it too); its words are here so they can be translated
    const title = wrapped.title;
    const titleCount = number(title.count);
    const titleText = {
        thief: {
            name: t('Shadows-touched Thief'),
            description: t('You stole {{count}} æmber. Your opponents never saw it go.', {
                count: titleCount
            })
        },
        hoarder: {
            name: t('Æmber Hoarder'),
            description: t('You captured {{count}} æmber, and kept it close.', {
                count: titleCount
            })
        },
        brawler: {
            name: t('Brobnar Brawler'),
            description: t('You destroyed {{count}} enemy creatures.', { count: titleCount })
        },
        harvester: {
            name: t('Untamed Harvester'),
            description: t('Your creatures reaped {{count}} times.', { count: titleCount })
        },
        gladiator: {
            name: t('Saurian Gladiator'),
            description: t('Your creatures fought {{count}} times.', { count: titleCount })
        },
        vault: {
            name: t('Unbroken Vault'),
            description: t('{{count}} of your wins were flawless. Your vault stayed sealed.', {
                count: titleCount
            })
        },
        seasoned: {
            name: t('Seasoned Archon'),
            description: t('{{count}} battles in the Crucible, and still forging.', {
                count: titleCount
            })
        }
    }[title.key] || { name: title.name, description: '' };

    // A new object would redraw the card back's canvas on every render, such as while sharing
    const topDeckBack = useMemo(
        () =>
            topDeck?.name && topDeck.houses.length === 3
                ? { name: topDeck.name, houses: topDeck.houses, cards: [] }
                : null,
        // The snapshot comes from the query cache, so topDeck keeps its identity between renders
        [topDeck]
    );

    const setName = (expansion) =>
        Constants.Expansions.find((set) => set.value === String(expansion))?.name;
    const sets = wrapped.sets.filter((set) => setName(set.expansion));
    const topDeckSet = topDeck?.expansion ? setName(topDeck.expansion) : null;

    /** @type {StoryCard[]} */
    const story = [];

    story.push({
        key: 'intro',
        background: Backgrounds.intro,
        content: (
            <div className='flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                <img alt={t('The Crucible Online')} className='w-[72cqw]' src={Logo} />
                <Big color='text-[#f0c44d]' size='text-[30cqw]'>
                    {wrapped.year}
                </Big>
                <Big size='text-[11cqw]'>{t("The Archon's Chronicle")}</Big>
                <Body>
                    {t('Archon {{username}}, the Crucible remembers your year.', { username })}
                </Body>
                <Pill>{period}</Pill>
            </div>
        )
    });

    story.push({
        key: 'games',
        background: Backgrounds.games,
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>{t('You entered the Crucible')}</Kicker>
                <Big>{number(wrapped.games)}</Big>
                <Body>
                    {plural(
                        Math.round(hours),
                        'times, and spent about an hour forging.',
                        'times, and spent about {{count}} hours forging.'
                    )}
                </Body>
                {rank(wrapped.ranks?.games, 'Among the top {{rank}}% of Archons for games played')}
                <div className='mt-[4cqw] flex h-[28cqw] items-end gap-[1.2cqw]'>
                    {wrapped.byMonth.map((count, month) => (
                        <div key={month} className='flex h-full flex-1 flex-col justify-end'>
                            <div
                                className={`rounded-t-[1cqw] ${
                                    month === busiestMonth
                                        ? 'bg-[#f0c44d] shadow-[0_0_4cqw_rgba(240,196,77,0.6)]'
                                        : 'bg-[#e9d9b0]/35'
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
        background: Backgrounds.record,
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <div className='flex gap-[2cqw]'>
                    {[KeyYellow, KeyRed, KeyBlue].map((key) => (
                        <img
                            key={key}
                            alt=''
                            className='w-[14cqw] drop-shadow-[0_0_3cqw_rgba(240,196,77,0.45)]'
                            src={key}
                        />
                    ))}
                </div>
                <Kicker>{t('Your victories')}</Kicker>
                <Big>{number(wrapped.wins)}</Big>
                <Body>
                    {plural(wrapped.wins, 'win', 'wins')}
                    {' · '}
                    {plural(wrapped.losses, '1 loss', '{{count}} losses')}
                </Body>
                {wrapped.games >= MinGamesForRates && (
                    <Big size='text-[12cqw]'>{t('{{rate}}% won', { rate: winRate })}</Big>
                )}
                <div className='grid grid-cols-2 gap-[4cqw]'>
                    <Fact label={t('Keys forged')} value={number(wrapped.keysForged)} />
                    <Fact label={t('Keys conceded')} value={number(wrapped.keysConceded)} />
                </div>
                <div className='flex flex-col gap-[2cqw]'>
                    {rank(wrapped.ranks?.wins, 'Among the top {{rank}}% of Archons for wins')}
                    {rank(
                        wrapped.ranks?.winRate,
                        'Among the top {{rank}}% of Archons for win rate'
                    )}
                </div>
            </div>
        )
    });

    if (wrapped.dominantWins > 0 || wrapped.longestWinStreak > 1 || wrapped.fastestWin) {
        story.push({
            key: 'highlights',
            background: Backgrounds.highlights,
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>{t('Your finest forges')}</Kicker>
                    {wrapped.dominantWins > 0 && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Big size='text-[20cqw]'>{number(wrapped.dominantWins)}</Big>
                            <Body>
                                {plural(
                                    wrapped.dominantWins,
                                    "flawless win, where your opponent didn't forge a single key.",
                                    "flawless wins, where your opponent didn't forge a single key."
                                )}
                            </Body>
                            {rank(
                                wrapped.ranks?.dominantWins,
                                'Among the top {{rank}}% of Archons'
                            )}
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
            background: Backgrounds.deck,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>{t('Your Archon of the year')}</Kicker>
                    {topDeckBack ? (
                        // The deck's identity card back: in KeyForge each deck is an Archon
                        <div className='w-[50cqw] drop-shadow-[0_0_8cqw_rgba(240,196,77,0.35)]'>
                            <CardBackImage
                                className='block aspect-[300/420] !h-auto !w-full'
                                deck={topDeckBack}
                            />
                        </div>
                    ) : (
                        topDeck.houses.length > 0 && (
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
                        )
                    )}
                    <Big size='text-[7.5cqw]'>{topDeck.name || t('A deck since deleted')}</Big>
                    {topDeckSet && (
                        <span className='-mt-[2cqw] text-[3.8cqw] text-[#e9d9b0]/75'>
                            {topDeckSet}
                        </span>
                    )}
                    <div className='grid w-full grid-cols-3 gap-[3cqw]'>
                        <Fact label={t('Games')} value={number(topDeck.games)} />
                        <Fact
                            label={t('Record')}
                            value={t('{{wins}}–{{losses}}', {
                                wins: topDeck.wins,
                                losses: topDeck.games - topDeck.wins
                            })}
                        />
                        <Fact label={t('Flawless wins')} value={number(topDeck.dominantWins)} />
                    </div>
                    {wrapped.deckCount > 1 && (
                        <Body className='text-[4.2cqw]'>
                            {t('One of {{count}} Archons who fought for you this year.', {
                                count: wrapped.deckCount
                            })}
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (sets.length > 0) {
        story.push({
            key: 'sets',
            background: Backgrounds.sets,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>{t('Your sets')}</Kicker>
                    <Big>{number(sets.length)}</Big>
                    <Body>
                        {sets.length === 1
                            ? t('All your Archons came from {{set}}.', {
                                  set: setName(sets[0].expansion)
                              })
                            : t('You fought with Archons from {{count}} different sets.', {
                                  count: sets.length
                              })}
                    </Body>
                    <div className='flex flex-col gap-[3cqw]'>
                        {sets.slice(0, MaxSetsShown).map((set) => (
                            <div key={set.expansion} className='flex items-center gap-[3cqw]'>
                                <img
                                    alt=''
                                    className='h-[9cqw] w-[9cqw] object-contain'
                                    src={Constants.SetIconPaths[String(set.expansion)]}
                                />
                                <span className='min-w-0 flex-1 truncate text-[5cqw] font-semibold text-white'>
                                    {setName(set.expansion)}
                                </span>
                                <span className='text-[4.2cqw] text-[#e9d9b0]/75'>
                                    {plural(set.games, '1 game', '{{count}} games')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        });
    }

    if (favourite) {
        story.push({
            key: 'house',
            background: Backgrounds.house,
            detailed: favourite.source === 'chosen',
            content: (
                <>
                    <HouseBackdrop house={favourite.house} />
                    <div className='relative flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                        <Kicker>{t('Your allegiance')}</Kicker>
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
            background: Backgrounds.mvp,
            detailed: true,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>{t('Your champion')}</Kicker>
                    {mvpImage && (
                        <img
                            alt={cardName(mvp.id)}
                            className='w-[56cqw] rounded-[3cqw] shadow-[0_0_10cqw_rgba(240,196,77,0.3)]'
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
            background: Backgrounds.amber,
            detailed: true,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>{t('Æmber')}</Kicker>
                    <div className='flex items-center gap-[3cqw]'>
                        <img
                            alt=''
                            className='w-[18cqw] drop-shadow-[0_0_5cqw_rgba(240,160,40,0.7)]'
                            src={AmberIcon}
                        />
                        <Big>{number(detailed.amberGained)}</Big>
                    </div>
                    <Body>{t('æmber gained in the Crucible.')}</Body>
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
            background: Backgrounds.opponents,
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>{t('Your rival')}</Kicker>
                    <div className='flex flex-col gap-[2cqw]'>
                        <Big size='text-[13cqw] break-words'>{wrapped.rival.name}</Big>
                        <Body>
                            {t('{{count}} battles against each other. You won {{wins}}.', {
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
                            'You faced one Archon this year.',
                            'You faced {{count}} different Archons this year.'
                        )}
                    </Body>
                </div>
            )
        });
    }

    story.push({
        key: 'time',
        background: Backgrounds.house,
        content: (
            <>
                <HouseBackdrop house={timeOfDay.house} />
                <div className='relative flex h-full flex-col justify-center gap-[5cqw]'>
                    <img
                        alt=''
                        className='w-[24cqw] drop-shadow-[0_2cqw_6cqw_rgba(0,0,0,0.6)]'
                        src={Constants.HouseIconPaths[timeOfDay.house]}
                    />
                    <Kicker>{t('When you enter the Crucible')}</Kicker>
                    <Big size='text-[15cqw]'>{t(timeOfDay.name)}</Big>
                    <Body>{t(timeOfDay.description)}</Body>
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        <Fact label={t('Peak hour')} value={formatHour(peakHour)} />
                        <Fact label={t('Busiest month')} value={monthName(busiestMonth)} />
                    </div>
                </div>
            </>
        )
    });

    story.push({
        key: 'title',
        background: Backgrounds.house,
        detailed: title.key !== 'vault' && title.key !== 'seasoned',
        content: (
            <>
                <HouseBackdrop house={title.house} />
                <div className='relative flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                    <Kicker>{t('The Crucible names you')}</Kicker>
                    {title.house && Constants.HouseIconPaths[title.house] && (
                        <img
                            alt=''
                            className='w-[38cqw] drop-shadow-[0_0_8cqw_rgba(240,196,77,0.45)]'
                            src={Constants.HouseIconPaths[title.house]}
                        />
                    )}
                    <Big color='text-[#f0c44d]' size='text-[13cqw]'>
                        {titleText.name}
                    </Big>
                    <Body>{titleText.description}</Body>
                </div>
            </>
        )
    });

    story.push({
        key: 'summary',
        background: Backgrounds.summary,
        content: (
            // The player's own Archon card
            <div className='flex h-full flex-col justify-center'>
                <div className='relative overflow-hidden rounded-[4cqw] border-[0.8cqw] border-[#c9a24a] bg-[#16110a] shadow-[0_0_10cqw_rgba(240,196,77,0.25)]'>
                    <HouseBackdrop house={favourite?.house || null} />
                    <div className='relative flex flex-col items-center gap-[3.5cqw] bg-gradient-to-b from-black/30 via-black/60 to-black/80 px-[6cqw] py-[6cqw] text-center'>
                        {topDeck?.houses?.length > 0 && (
                            <div className='flex gap-[2cqw]'>
                                {topDeck.houses.map((house) => (
                                    <img
                                        key={house}
                                        alt=''
                                        className='w-[11cqw]'
                                        src={Constants.HouseIconPaths[house]}
                                    />
                                ))}
                            </div>
                        )}
                        <div className='flex flex-col gap-[1cqw]'>
                            <Kicker>{t('Chronicle of {{year}}', { year: wrapped.year })}</Kicker>
                            <Big size='text-[11cqw] break-words'>{username}</Big>
                            <span className='text-[4.6cqw] font-semibold text-[#f0c44d]'>
                                {titleText.name}
                            </span>
                        </div>
                        <Rule />
                        <div className='grid w-full grid-cols-2 gap-x-[4cqw] gap-y-[3.5cqw] text-left'>
                            <Fact label={t('Games')} value={number(wrapped.games)} />
                            <Fact
                                label={t('Record')}
                                value={t('{{wins}}–{{losses}}', {
                                    wins: wrapped.wins,
                                    losses: wrapped.losses
                                })}
                            />
                            <Fact label={t('Flawless wins')} value={number(wrapped.dominantWins)} />
                            <Fact label={t('Keys forged')} value={number(wrapped.keysForged)} />
                            {favourite && (
                                <Fact label={t('Allegiance')} value={houseLabel(favourite.house)} />
                            )}
                            {mvp && <Fact label={t('Champion')} value={cardName(mvp.id)} />}
                        </div>
                        {topDeck?.name && (
                            <>
                                <Rule />
                                <div className='flex flex-col'>
                                    <span className='text-[3.6cqw] uppercase tracking-wider text-[#e9d9b0]/65'>
                                        {t('Archon of the year')}
                                    </span>
                                    <span className='text-[5cqw] font-semibold leading-tight text-white'>
                                        {topDeck.name}
                                    </span>
                                </div>
                            </>
                        )}
                        <Pill>{t(timeOfDay.name)}</Pill>
                    </div>
                </div>
            </div>
        )
    });

    return story.map((card) => ({
        ...card,
        note: card.detailed ? detailedNote : null
    }));
};

export default useWrappedCards;
