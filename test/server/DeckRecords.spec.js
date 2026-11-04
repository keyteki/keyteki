const db = require('../../server/db');
const DeckService = require('../../server/services/DeckService');
const PendingGame = require('../../server/pendinggame');

describe('Deck records', function () {
    describe('when saving a game', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });

            this.savedPlayer = (player) =>
                this.game.getSaveState().players.find((p) => p.name === player.name);
        });

        it('should record the Master Vault id of the deck played', function () {
            this.player1.player.deckData = { identity: 'Deck One', uuid: 'deck-one-uuid' };

            expect(this.savedPlayer(this.player1.player).deckUuid).toBe('deck-one-uuid');
        });

        it('should not record an id for alliance decks', function () {
            this.player1.player.deckData = {
                identity: 'My Alliance',
                isAlliance: true,
                uuid: 'alliance-uuid'
            };

            expect(this.savedPlayer(this.player1.player).deckUuid).toBeUndefined();
        });

        it('should not record an id for standalone decks', function () {
            this.player1.player.deckData = {
                identity: 'Starter',
                isStandalone: true,
                uuid: 'standalone-uuid'
            };

            expect(this.savedPlayer(this.player1.player).deckUuid).toBeUndefined();
        });
    });

    describe('DeckService', function () {
        beforeEach(function () {
            this.service = new DeckService({}, {});
            this.row = { Id: 1, IsAlliance: false, Name: 'Deck One', Uuid: 'deck-uuid' };
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should map the deck stats columns to a record', function () {
            const deck = this.service.mapDeck({
                ...this.row,
                RecordDominantWins: '4',
                RecordGames: '12',
                RecordWins: '9'
            });

            expect(deck.record).toEqual({ dominantWins: 4, games: 12, losses: 3, wins: 9 });
        });

        it('should give an empty record to a deck with no games', function () {
            const deck = this.service.mapDeck({
                ...this.row,
                RecordDominantWins: null,
                RecordGames: null,
                RecordWins: null
            });

            expect(deck.record).toEqual({ dominantWins: 0, games: 0, losses: 0, wins: 0 });
        });

        it('should give no record to alliance decks', function () {
            const deck = this.service.mapDeck({
                ...this.row,
                IsAlliance: true,
                RecordDominantWins: '1',
                RecordGames: '2',
                RecordWins: '1'
            });

            expect(deck.record).toBeUndefined();
        });

        it('should give no record when the query did not select one', function () {
            expect(this.service.mapDeck(this.row).record).toBeUndefined();
        });

        it("should count the deck owner's own games when fetching a deck by id", async function () {
            const query = vi.spyOn(db, 'query').mockResolvedValue([]);

            await this.service.getById(42);

            const sql = query.mock.calls[0][0];
            expect(sql).toContain('g."WinnerId" = d."UserId"');
            expect(sql).not.toContain('g."WinnerId" = $1');
        });

        it('should keep the usage count column name so mapDeck can read it', async function () {
            const query = vi.spyOn(db, 'query').mockResolvedValue([]);

            await this.service.getById(42);
            await this.service.findForUser({ id: 1 });

            for (const [sql] of query.mock.calls) {
                expect(sql).toContain('AS "DeckCount"');
            }
            expect(this.service.mapDeck({ DeckCount: '7' }).usageCount).toBe('7');
        });

        it('should refresh the deck stats view without blocking reads', async function () {
            const query = vi.spyOn(db, 'query').mockResolvedValue([]);

            await this.service.refreshDeckStats();

            expect(query).toHaveBeenCalledWith(
                'REFRESH MATERIALIZED VIEW CONCURRENTLY "DeckStats"'
            );
        });
    });

    describe('pending game summary', function () {
        beforeEach(function () {
            const owner = { username: 'host', hasUserBlocked: () => false };
            this.game = new PendingGame(owner, { gameFormat: 'normal', gameType: 'casual' });
            this.game.addPlayer('1', owner);
            this.game.players.host.deck = {
                name: 'Host Deck',
                record: { dominantWins: 1, games: 6, losses: 2, wins: 4 },
                selected: true,
                status: {}
            };
        });

        it('should show the deck record to its owner', function () {
            expect(this.game.getSummary('host').players.host.deck.record).toEqual({
                dominantWins: 1,
                games: 6,
                losses: 2,
                wins: 4
            });
        });

        it('should show the deck record but not the deck name to the opponent', function () {
            const deck = this.game.getSummary('guest').players.host.deck;

            expect(deck.record.games).toBe(6);
            expect(deck.name).toBeUndefined();
        });
    });
});
