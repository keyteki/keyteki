const _ = require('underscore');

const logger = require('../log.js');

class GameService {
    constructor(db) {
        this.games = db.get('games');
    }

    create(game) {
        return this.games.insert(game)
            .catch(err => {
                logger.error('Unable to create game', err);
                throw new Error('Unable to create game');
            });
    }

    update(game) {
        let properties = {
            startedAt: game.startedAt,
            players: game.players,
            winner: game.winner,
            winReason: game.winReason,
            finishedAt: game.finishedAt
        };
        return this.games.update({ gameId: game.gameId }, { '$set': properties })
            .catch(err => {
                logger.error('Unable to update game', err);
                throw new Error('Unable to update game');
            });
    }

    getAllGames(from, to) {
        return this.games.find()
            .then(games => {
                return _.filter(games, game => {
                    return game.startedAt >= from && game.startedAt < to;
                });
            })
            .catch(err => {
                logger.error('Unable to get all games from', from, 'to', to, err);
                throw new Error('Unable to get all games');
            });
    }

    async findByUserName(username) {
        let games = await this.games.aggregate([
            {
                '$lookup': {
                    'from': 'decks',
                    'localField': 'players.deck',
                    'foreignField': 'identity',
                    'as': 'decks'
                }
            },
            {
                '$match': {
                    '$and': [
                        {
                            'players.name': username
                        },
                        {
                            'players.deck': {
                                '$ne': null
                            }
                        }
                    ]
                }
            },
            {
                '$sort': {
                    'finishedAt': -1
                }
            },
            {
                '$limit': 30
            }
        ]);

        // Make sure position zero is always the given username
        games.forEach(game => {
            if(game.players && game.players[0] && game.players[1] && game.decks[0] && game.decks[1]) {
                if(game.players[1].name === username) {
                    let opponent = game.players[0];
                    game.players[0] = game.players[1];
                    game.players[1] = opponent;
                }

                if(game.players[0].deck === game.decks[1].identity) {
                    let oppDeck = game.decks[0];
                    game.decks[0] = game.decks[1];
                    game.decks[1] = oppDeck;
                }
            }
        });

        return games;
    }
}

module.exports = GameService;

