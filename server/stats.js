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
    let factionWinners = {};

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            return;
        }

        if(game.winner) {
            if(winners[game.winner]) {
                winners[game.winner]++;
            } else {
                winners[game.winner] = 1;
            }
        }
    });

    console.info(winners);
});

 
