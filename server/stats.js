/*eslint no-console: 0*/

const _ = require('underscore');
const monk = require('monk');

const Constants = require('./constants.js');
const GameService = require('./services/GameService.js');
const config = require('config');

const bannedDecks = [
    'flaregas-spawn-of-conflascoot',
    'thomsen-of-trinitop',
    'khyrmn-hierophant-of-the-nihilistic-haunt'
];

const db = monk(config.dbPath);
const gameService = new GameService(db);
/*
let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    db.close();
    return;
}
*/

const start = new Date('2018-08-26T13:00:00');
const end = new Date();
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Running stats between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        const rejected = { singlePlayer: 0, noWinner: 0, banned: 0, mirror: 0 };

        console.info('' + _.size(games), 'total games');

        const players = {};
        const decks = {};
        const fpWinRates = { first: 0, second: 0 };
        const houses = {};
        for (const house of Constants.Houses) {
            houses[house] = { name: house, wins: 0, losses: 0 };
        }

        _.each(games, (game) => {
            if (_.size(game.players) !== 2) {
                rejected.singlePlayer++;

                return;
            }

            if (!game.winner) {
                rejected.noWinner++;

                return;
            } else if (game.players.some((player) => bannedDecks.includes(player.deck))) {
                rejected.banned++;
                return;
            } else if (game.players[0].deck === game.players[1].deck) {
                rejected.mirror++;
                return;
            }

            if (
                (game.players[0].turns === game.players[1].turns) ===
                (game.winner === game.players[0].name)
            ) {
                fpWinRates.first++;
            } else {
                fpWinRates.second++;
            }

            _.each(game.players, (player) => {
                if (!players[player.name]) {
                    players[player.name] = { name: player.name, wins: 0, losses: 0 };
                }

                if (!decks[player.deck]) {
                    decks[player.deck] = { name: player.deck, wins: 0, losses: 0 };
                }

                const playerStat = players[player.name];
                const deckStat = decks[player.deck];

                if (player.name === game.winner) {
                    playerStat.wins++;
                    deckStat.wins++;
                    _.each(player.houses, (house) => houses[house].wins++);
                } else {
                    playerStat.losses++;
                    deckStat.losses++;
                    _.each(player.houses, (house) => houses[house].losses++);
                }
            });
        });

        const winners = _.chain(players)
            .sortBy((player) => {
                return -player.wins;
            })
            .first(10)
            .value();

        const winRates = _.map(winners, (player) => {
            const games = player.wins + player.losses;

            return {
                name: player.name,
                wins: player.wins,
                losses: player.losses,
                winRate: Math.round((player.wins / games) * 100)
            };
        });

        const winRateStats = _.chain(winRates)
            .sortBy((player) => {
                return -player.winRate;
            })
            .first(10)
            .value();

        // let factionWinners = _.sortBy(factions, faction => {
        //     return -faction.wins;
        // });

        const deckWinRates = _.map(decks, (deck) => {
            const games = deck.wins + deck.losses;

            return {
                name: deck.name,
                wins: deck.wins,
                losses: deck.losses,
                winRate: Math.round((deck.wins / games) * 100)
            };
        });

        const houseWinRates = _.map(houses, (house) => {
            // eslint-disable-line no-unused-vars
            const games = house.wins + house.losses;

            return {
                name: house.name,
                wins: house.wins,
                losses: house.losses,
                winRate: Math.round((house.wins / games) * 100)
            };
        });

        const deckWinRateStats = _.sortBy(deckWinRates, (deck) => {
            return -deck.winRate;
        });

        console.info('### Top 10\n\nName | Number of wins\n----|----------------');

        _.each(winners, (winner) => {
            console.info(winner.name, ' | ', winner.wins);
        });

        console.info(
            '### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
        );

        _.each(winRateStats, (winner) => {
            console.info(
                winner.name,
                ' | ',
                winner.wins,
                ' | ',
                winner.losses,
                ' | ',
                winner.winRate + '%'
            );
        });

        console.info(
            '### Deck win rates\n\nDeck | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
        );

        _.each(deckWinRateStats, (winner) => {
            console.info(
                winner.name,
                ' | ',
                winner.wins,
                ' | ',
                winner.losses,
                ' | ',
                winner.winRate + '%'
            );
        });

        console.info(
            '### House win rates\n\nHouse | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
        );

        _.each(houseWinRates, (house) => {
            console.info(
                house.name,
                ' | ',
                house.wins,
                ' | ',
                house.losses,
                ' | ',
                house.winRate + '%'
            );
        });

        console.info(
            'First Player win rate:',
            Math.round((fpWinRates.first / (fpWinRates.first + fpWinRates.second)) * 100) + '%'
        );

        console.info(rejected);
    })
    .then(() => db.close())
    .catch((error) => {
        console.log(error);
        db.close();
    });
