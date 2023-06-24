describe('Rogue Operation', function () {
    describe("Rogue Operation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['bubbles', 'rogue-operation', 'away-team', 'crash-muldoon'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should do nothing if deck is empty', function () {
            this.player1.player.deck = [];
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player1.player.deck.length).toBe(0);

            this.player1.play(this.rogueOperation);

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.player.deck.length).toBe(0);

            this.player1.endTurn();
        });

        it('should steal 1 if only 1 card', function () {
            this.player1.player.deck = [];
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.moveCard(this.awayTeam, 'deck');

            this.player1.play(this.rogueOperation);

            expect(this.awayTeam.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);

            this.player1.endTurn();
        });

        it('should steal 2 if 2 differnt houses are discarded', function () {
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.moveCard(this.awayTeam, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');

            this.player1.play(this.rogueOperation);

            expect(this.awayTeam.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should steal 1 if same houses are discarded', function () {
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            this.player1.moveCard(this.awayTeam, 'deck');
            this.player1.moveCard(this.crashMuldoon, 'deck');

            this.player1.play(this.rogueOperation);

            expect(this.awayTeam.location).toBe('discard');
            expect(this.crashMuldoon.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);

            this.player1.endTurn();
        });
    });
});
