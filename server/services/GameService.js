const logger = require('../log.js');
const db = require('../db');

const DeckIdForPlayerQuery =
    '(SELECT "Id" FROM "Decks" WHERE "Identity" = $3 AND "UserId" = (SELECT "Id" FROM "Users" WHERE "Username" = $2) ORDER BY "Id" DESC LIMIT 1)';

class GameService {
    async create(game) {
        try {
            await db.transaction(async (client) => {
                const newGame = await db.queryTran(
                    client,
                    'INSERT INTO "Games" ("GameId", "GameType", "GameFormat", "StartedAt") VALUES ($1, $2, $3, $4) RETURNING "Id"',
                    [game.gameId, game.gameType, game.gameFormat, game.startedAt]
                );

                if (!newGame || newGame.length === 0) {
                    throw new Error('No game row returned');
                }

                const gameId = newGame[0].Id;

                for (const player of game.players) {
                    await db.queryTran(
                        client,
                        'INSERT INTO "GamePlayers" ("GameId", "PlayerId", "DeckId") VALUES ' +
                            `($1, (SELECT "Id" FROM "Users" WHERE "Username" = $2), ${DeckIdForPlayerQuery})`,
                        [gameId, player.name, player.deck]
                    );
                }
            });
        } catch (err) {
            logger.error(`Failed to create game ${game.gameId}`, err);

            throw new Error('Failed to create game');
        }
    }

    async update(game) {
        try {
            await db.transaction(async (client) => {
                await db.queryTran(
                    client,
                    'UPDATE "Games" SET "StartedAt" = $2, "WinnerId" = (SELECT "Id" FROM "Users" WHERE "Username" = $3), "WinReason" = $4, "FinishedAt" = $5 WHERE "GameId" = $1',
                    [game.gameId, game.startedAt, game.winner, game.winReason, game.finishedAt]
                );

                for (const player of game.players) {
                    const keys = player.keys
                        ? ['red', 'yellow', 'blue'].filter((colour) => player.keys[colour]).length
                        : 0;

                    await db.queryTran(
                        client,
                        `UPDATE "GamePlayers" SET "Keys" = $4, "DeckId" = ${DeckIdForPlayerQuery}, "Turn" = $5, "Stats" = $6 ` +
                            'WHERE "GameId" = (SELECT "Id" FROM "Games" WHERE "GameId" = $1) AND "PlayerId" = (SELECT "Id" FROM "Users" WHERE "Username" = $2)',
                        [
                            game.gameId,
                            player.name,
                            player.deck,
                            keys,
                            player.turn,
                            player.stats ? JSON.stringify(player.stats) : null
                        ]
                    );
                }
            });
        } catch (err) {
            logger.error(`Failed to update game ${game.gameId}`, err);

            throw new Error('Failed to update game');
        }
    }

    getAllGames(from, to) {
        return this.games
            .find()
            .then((games) => {
                return games.filter((game) => {
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
