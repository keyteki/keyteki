describe('FreshMarks', function () {
    describe("FreshMarks's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    hand: ['fresh-marks'],
                    inPlay: ['flaxia', 'bubbles']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'alaka', 'brammo']
                }
            });
        });

        it('should require a friendly creature to be destroyed to have an effect', function () {
            this.player1.moveCard(this.flaxia, 'hand');
            this.player1.moveCard(this.bubbles, 'hand');

            expect(this.gub.tokens.amber).toBeUndefined();
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.alaka.tokens.amber).toBeUndefined();
            expect(this.brammo.tokens.amber).toBeUndefined();

            this.player1.play(this.freshMarks);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.alaka);
            expect(this.player1).not.toBeAbleToSelect(this.brammo);

            expect(this.gub.tokens.amber).toBeUndefined();
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.alaka.tokens.amber).toBeUndefined();
            expect(this.brammo.tokens.amber).toBeUndefined();

            this.player1.endTurn();
        });

        it('should exalt 3 enemy cretures if a friendly is destroyed', function () {
            expect(this.gub.tokens.amber).toBeUndefined();
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.alaka.tokens.amber).toBeUndefined();
            expect(this.brammo.tokens.amber).toBeUndefined();

            this.player1.play(this.freshMarks);

            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.alaka);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');

            expect(this.gub.tokens.amber).toBe(1);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.alaka.tokens.amber).toBe(1);
            expect(this.brammo.tokens.amber).toBeUndefined();
            expect(this.flaxia.location).toBe('discard');

            this.player1.endTurn();
        });

        it('should give choice of which friendly creature to destroy', function () {
            this.player1.play(this.freshMarks);

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.bubbles);

            this.player1.clickCard(this.bubbles);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.alaka);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');

            expect(this.bubbles.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');

            this.player1.endTurn();
        });
    });
});
