const _ = require('underscore');

const logger = require('../log.js');
const db = require('../db');

class GameService {
    async create(game) {
        let gameId;

        await db.query('BEGIN');

        try {
            let newGame = await db.query(
                'INSERT INTO "Games" ("GameId", "GameType", "GameFormat", "StartedAt") VALUES ($1, $2, $3, $4) RETURNING "Id"',
                [game.gameId, game.gameType, game.gameFormat, game.startedAt]
            );

            if (!newGame || newGame.length === 0) {
                logger.error('Failed to create game');
                await db.query('ROLLBACK');

                throw new Error('Failed to create game');
            }

            gameId = newGame[0].Id;
        } catch (err) {
            logger.error('Failed to create game', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to create game');
        }

        for (let player of game.players) {
            try {
                await db.query(
                    'INSERT INTO "GamePlayers" ("GameId", "PlayerId", "DeckId") VALUES ' +
                        '($1, (SELECT "Id" FROM "Users" WHERE "Username" = $2), (SELECT "Id" FROM "Decks" WHERE "Identity" = $3))',
                    [gameId, player.name, player.deck]
                );
            } catch (err) {
                logger.error('Failed to create game player', err);

                await db.query('ROLLBACK');

                throw new Error('Failed to create game player');
            }
        }

        await db.query('COMMIT');
    }

    async update(game) {
        await db.query('BEGIN');

        try {
            await db.query(
                'UPDATE "Games" SET "StartedAt" = $2, "WinnerId" = (SELECT "Id" FROM "Users" WHERE "Username" = $3), "WinReason" = $4, "FinishedAt" = $5 WHERE "GameId" = $1',
                [game.gameId, game.startedAt, game.winner, game.winReason, game.finishedAt]
            );
        } catch (err) {
            await db.query('ROLLBACK');

            throw new Error('Failed to update game');
        }

        for (let player of game.players) {
            let keys = 0;

            if (player.keys && player.keys.red !== undefined) {
                if (player.keys.red) {
                    keys++;
                }

                if (player.keys.yellow) {
                    keys++;
                }

                if (player.keys.blue) {
                    keys++;
                }
            }

            try {
                await db.query(
                    'UPDATE "GamePlayers" SET "Keys" = $1, ' +
                        '"DeckId" = (SELECT "Id" FROM "Decks" WHERE "Identity" = $5 AND "UserId" = (SELECT "Id" FROM "Users" WHERE "Username" = $4)), ' +
                        '"Turn" = $2 WHERE "GameId" = (SELECT "Id" FROM "Games" WHERE "GameId" = $3) AND "PlayerId" = (SELECT "Id" FROM "Users" WHERE "Username" = $4)',
                    [keys, player.turn, game.gameId, player.name, player.deck]
                );
            } catch (err) {
                logger.error(
                    `Failed to update game player ${game.gameId}, ${player.name} ${player.deck}`,
                    err
                );

                await db.query('ROLLBACK');

                throw new Error('Failed to update game player');
            }
        }

        await db.query('COMMIT');
    }

    getAllGames(from, to) {
        return this.games
            .find()
            .then((games) => {
                return _.filter(games, (game) => {
                    return game.startedAt >= from && game.startedAt < to;
                });
            })
            .catch((err) => {
                logger.error('Unable to get all games from', from, 'to', to, err);
                throw new Error('Unable to get all games');
            });
    }

    async findByUserName(username) {
        let games = await this.games.aggregate([
            {
                $lookup: {
                    from: 'decks',
                    localField: 'players.deck',
                    foreignField: 'identity',
                    as: 'decks'
                }
            },
            {
                $match: {
                    $and: [
                        {
                            'players.name': username
                        },
                        {
                            'players.deck': {
                                $ne: null
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    finishedAt: -1
                }
            },
            {
                $limit: 30
            }
        ]);

        // Make sure position zero is always the given username
        games.forEach((game) => {
            if (
                game.players &&
                game.players[0] &&
                game.players[1] &&
                game.decks[0] &&
                game.decks[1]
            ) {
                if (game.players[1].name === username) {
                    let opponent = game.players[0];
                    game.players[0] = game.players[1];
                    game.players[1] = opponent;
                }

                if (game.players[0].deck === game.decks[1].identity) {
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
