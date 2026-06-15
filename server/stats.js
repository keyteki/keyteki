/*eslint no-console: 0*/

const monk = require('monk');

const Constants = require('./constants.js');
const GameService = require('./services/GameService.js');
const config = require('config');

const bannedDecks = [
    'flaregas-spawn-of-conflascoot',
    'thomsen-of-trinitop',
    'khyrmn-hierophant-of-the-nihilistic-haunt'
];

let db = monk(config.dbPath);
let gameService = new GameService(db);

let start = new Date('2018-08-26T13:00:00');
let end = new Date();
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Running stats between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        let rejected = { singlePlayer: 0, noWinner: 0, banned: 0, mirror: 0 };

        console.info('' + games.length, 'total games');

        let players = {};
        let decks = {};
        let fpWinRates = { first: 0, second: 0 };
        let houses = {};
        for (let house of Constants.Houses) {
            houses[house] = { name: house, wins: 0, losses: 0 };
        }

        games.forEach((game) => {
            if (Object.keys(game.players).length !== 2) {
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

            game.players.forEach((player) => {
                if (!players[player.name]) {
                    players[player.name] = { name: player.name, wins: 0, losses: 0 };
                }

                if (!decks[player.deck]) {
                    decks[player.deck] = { name: player.deck, wins: 0, losses: 0 };
                }

                var playerStat = players[player.name];
                var deckStat = decks[player.deck];

                if (player.name === game.winner) {
                    playerStat.wins++;
                    deckStat.wins++;
                    player.houses.forEach((house) => houses[house].wins++);
                } else {
                    playerStat.losses++;
                    deckStat.losses++;
                    player.houses.forEach((house) => houses[house].losses++);
                }
            });
        });

        let winners = Object.values(players)
            .sort((a, b) => b.wins - a.wins)
            .slice(0, 10);

        let winRates = winners.map((player) => {
            let games = player.wins + player.losses;

            return {
                name: player.name,
                wins: player.wins,
                losses: player.losses,
                winRate: Math.round((player.wins / games) * 100)
            };
        });

        let winRateStats = winRates.sort((a, b) => b.winRate - a.winRate).slice(0, 10);

        let deckWinRates = decks.map((deck) => {
            let games = deck.wins + deck.losses;

            return {
                name: deck.name,
                wins: deck.wins,
                losses: deck.losses,
                winRate: Math.round((deck.wins / games) * 100)
            };
        });

        let houseWinRates = houses.map((house) => {
            // eslint-disable-line no-unused-vars
            let games = house.wins + house.losses;

            return {
                name: house.name,
                wins: house.wins,
                losses: house.losses,
                winRate: Math.round((house.wins / games) * 100)
            };
        });

        let deckWinRateStats = [...deckWinRates].sort((a, b) => b.winRate - a.winRate);

        console.info('### Top 10\n\nName | Number of wins\n----|----------------');

        winners.forEach((winner) => {
            console.info(winner.name, ' | ', winner.wins);
        });

        console.info(
            '### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
        );

        winRateStats.forEach((winner) => {
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

        deckWinRateStats.forEach((winner) => {
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

        houseWinRates.forEach((house) => {
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
