/*eslint no-console: 0*/

const _ = require('underscore');
const monk = require('monk');

const GameService = require('./services/GameService.js');
const config = require('config');

let db = monk(config.dbPath);
let gameService = new GameService(db);
/*
let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    db.close();
    return;
}
*/

let start = new Date('2018-08-26T13:00:00');
let end = new Date();
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Running stats between', start, 'and', end);

gameService.getAllGames(start, end).then(games => {
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info('' + _.size(games), 'total games');

    let players = {};
    let decks = {};
    let fpWinRates = { first: 0, second: 0 };
    let houses = {
        brobnar: { name: 'brobnar', wins: 0, losses: 0 },
        dis: { name: 'dis', wins: 0, losses: 0 },
        logos: { name: 'logos', wins: 0, losses: 0 },
        mars: { name: 'mars', wins: 0, losses: 0 },
        sanctum: { name: 'sanctum', wins: 0, losses: 0 },
        shadows: { name: 'shadows', wins: 0, losses: 0 },
        untamed: { name: 'untamed', wins: 0, losses: 0 }
    };

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;

            return;
        }

        if(!game.winner) {
            rejected.noWinner++;

            return;
        }

        if((game.players[0].turns === game.players[1].turns) === (game.winner === game.players[0].name)) {
            fpWinRates.first++;
        } else {
            fpWinRates.second++;
        }

        _.each(game.players, player => {
            if(!players[player.name]) {
                players[player.name] = { name: player.name, wins: 0, losses: 0 };
            }

            if(!decks[player.deck]) {
                decks[player.deck] = { name: player.deck, wins: 0, losses: 0 };
            }

            var playerStat = players[player.name];
            var deckStat = decks[player.deck];

            if(player.name === game.winner) {
                playerStat.wins++;
                deckStat.wins++;
                _.each(player.houses, house => houses[house].wins++);
            } else {
                playerStat.losses++;
                deckStat.losses++;
                _.each(player.houses, house => houses[house].losses++);
            }
        });
    });

    let winners = _.chain(players).sortBy(player => {
        return -player.wins;
    }).first(10).value();

    let winRates = _.map(winners, player => {
        let games = player.wins + player.losses;

        return { name: player.name, wins: player.wins, losses: player.losses, winRate: Math.round(((player.wins / games) * 100)) };
    });

    let winRateStats = _.chain(winRates).sortBy(player => {
        return -player.winRate;
    }).first(10).value();

    // let factionWinners = _.sortBy(factions, faction => {
    //     return -faction.wins;
    // });

    let deckWinRates = _.map(decks, deck => {
        let games = deck.wins + deck.losses;

        return { name: deck.name, wins: deck.wins, losses: deck.losses, winRate: Math.round(((deck.wins / games) * 100)) };
    });

    let houseWinRates = _.map(houses, house => { // eslint-disable-line no-unused-vars
        let games = house.wins + house.losses;

        return { name: house.name, wins: house.wins, losses: house.losses, winRate: Math.round(((house.wins / games) * 100)) };
    });

    let deckWinRateStats = _.sortBy(deckWinRates, deck => {
        return - deck.winRate;
    });

    console.info('### Top 10\n\nName | Number of wins\n----|----------------');

    _.each(winners, winner => {
        console.info(winner.name, ' | ', winner.wins);
    });

    console.info('### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(winRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### Deck win rates\n\nDeck | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(deckWinRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### House win rates\n\nHouse | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(houseWinRates, house => {
        console.info(house.name, ' | ', house.wins, ' | ', house.losses, ' | ', house.winRate + '%');
    });

    console.info('First Player win rate:', Math.round(fpWinRates.first / (fpWinRates.first + fpWinRates.second) * 100) + '%');

    console.info(rejected);
})
    .then(() => db.close())
    .catch(error => {
        console.log(error);
        db.close();
    });
