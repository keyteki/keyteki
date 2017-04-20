/*eslint no-console: 0*/

const _ = require('underscore');

const GameRepository = require('./repositories/gameRepository.js');
const config = require('./config.js');

let gameRepository = new GameRepository(config.dbPath);

let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    return;
}

console.info('Running stats between', args[0], 'and', args[1]);

gameRepository.getAllGames(args[0], args[1], (err, games) => {
    let winners = {};
    let factionWinners = {};
    let factionAgendaWinners = {};
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info('' + _.size(games), 'total games');

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;
            return;
        }

        if(game.winner) {
            let winningPlayer = _.find(game.players, player => {
                return player.name === game.winner;
            });

            if(winners[game.winner]) {
                winners[game.winner].count++;
            } else {
                winners[game.winner] = { name: game.winner, count: 1 };
            }

            if(factionWinners[winningPlayer.faction]) {
                factionWinners[winningPlayer.faction].count++;
            } else {
                factionWinners[winningPlayer.faction] = { name: winningPlayer.faction, count: 1 };
            }

            let factionAgenda = winningPlayer.faction + ' ' + winningPlayer.agenda;

            if(factionAgendaWinners[factionAgenda]) {
                factionAgendaWinners[factionAgenda].count++;
            } else {
                factionAgendaWinners[factionAgenda] = { name: factionAgenda, count: 1 };
            }

        } else {
            rejected.noWinner++;
        }
    });

    winners = _.chain(winners).sortBy(item => {
        return -item.count;
    }).first(10).value();

    factionWinners = _.sortBy(factionWinners, item => {
        return -item.count;
    });

    factionAgendaWinners = _.chain(factionAgendaWinners).sortBy(item => {
        return -item.count;
    }).first(10).value();

    console.info(winners);
    console.info(factionWinners);
    console.info(factionAgendaWinners);
    console.info(rejected);
});
