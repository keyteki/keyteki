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
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info('' + _.size(games), 'total games');

    let players = {};
    let factions = {};
    let factionAgendas = {};

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;

            return;
        }

        if(!game.winner) {
            rejected.noWinner++;

            return;
        }

        _.each(game.players, player => {
            if(!players[player.name]) {
                players[player.name] = { name: player.name, wins: 0, losses: 0 };
            }

            if(!factions[player.faction]) {
                factions[player.faction] = { name: player.faction, wins: 0, losses: 0 };
            }

            if(!factionAgendas[player.faction + player.agenda]) {
                factionAgendas[player.faction + player.agenda] = { name: player.faction + ' / ' + player.agenda, wins: 0, losses: 0 };
            }

            var playerStat = players[player.name];
            var factionStat = factions[player.faction];
            var factionAgendaStat = factionAgendas[player.faction + player.agenda];

            if(player.name === game.winner) {
                playerStat.wins++;
                factionStat.wins++;
                factionAgendaStat.wins++;
            } else {
                playerStat.losses++;
                factionStat.losses++;
                factionAgendaStat.losses++;
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

    let factionWinRates = _.map(factions, faction => {
        let games = faction.wins + faction.losses;

        return { name: faction.name, wins: faction.wins, losses: faction.losses, winRate: Math.round(((faction.wins / games) * 100)) };
    });

    let factionWinRateStats = _.sortBy(factionWinRates, faction => {
        return - faction.winRate;
    });

    let factionAgendaWinners = _.chain(factionAgendas).sortBy(faction => {
        return -faction.wins;
    }).first(10).value();

    let factionAgendaWinRates = _.map(factionAgendaWinners, faction => {
        let games = faction.wins + faction.losses;

        return { name: faction.name, wins: faction.wins, losses: faction.losses, winRate: Math.round(((faction.wins / games) * 100)) };
    });

    let factionAgendaWinRateStats = _.chain(factionAgendaWinRates).sortBy(faction => {
        return - faction.winRate;
    }).first(10).value();

    console.info('### Top 10\n\nName | Number of wins\n----|----------------');

    _.each(winners, winner => {
        console.info(winner.name, ' | ', winner.wins);
    });

    console.info('### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(winRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### Faction win rates\n\nFaction | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(factionWinRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### Faction/Agenda combination win rates\n\nFaction/Agenda | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(factionAgendaWinRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info(rejected);
});
