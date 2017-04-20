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

console.info('Running stats...');

gameRepository.getAllGames(args[0], args[1], (err, games) => {
    let winners = {};
    //let factionWinners = {};
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info(_.size(games), 'total games');

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;
            console.info(game.startedAt, _.size(game.players));
            return;
        }

        if(game.winner) {
            if(winners[game.winner]) {
                winners[game.winner].count++;
            } else {
                winners[game.winner] = { name: game.winner, count: 1 };
            }
        } else {
            rejected.noWinner++;
            console.info(game);
        }
    });

    winners = _.sortBy(winners, item => {
        return item.count;
    }).reverse();

    console.info(winners);
    console.info(rejected);
});
