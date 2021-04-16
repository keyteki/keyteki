describe('Together!', function () {
    describe("Together!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['together', 'flaxia', 'quant', 'scout-pete', 'all-tide-up'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should prompt to play a non-star alliance card when tide is low', function () {
            expect(this.flaxia.location).not.toBe('play area');

            this.player1.play(this.together);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.quant);
            expect(this.player1).not.toBeAbleToSelect(this.scoutPete);
            this.player1.clickCard(this.flaxia);

            this.player1.endTurn();
            expect(this.flaxia.location).toBe('play area');
        });

        it('should prompt to play a non-star alliance card when tide is low and cancel', function () {
            expect(this.flaxia.location).not.toBe('play area');

            this.player1.play(this.together);
            this.player1.clickPrompt('Done');

            this.player1.endTurn();
            expect(this.flaxia.location).not.toBe('play area');
        });

        it('should prompt to play two non-star alliance cards when tide is high', function () {
            this.player1.raiseTide();

            expect(this.flaxia.location).not.toBe('play area');
            expect(this.quant.location).not.toBe('play area');

            this.player1.play(this.together);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.quant);
            this.player1.clickPrompt('Left');

            this.player1.endTurn();
            expect(this.flaxia.location).toBe('play area');
            expect(this.quant.location).toBe('play area');
        });

        it('should allow canceling second card when tide is high', function () {
            this.player1.raiseTide();

            expect(this.flaxia.location).not.toBe('play area');
            expect(this.quant.location).not.toBe('play area');

            this.player1.play(this.together);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');

            this.player1.endTurn();
            expect(this.flaxia.location).toBe('play area');
        });

        it('should prompt to play two a non-star alliance cards when first card raised the tide', function () {
            this.player1.lowerTide();
            expect(this.quant.location).not.toBe('play area');

            this.player1.play(this.together);
            this.player1.clickCard(this.allTideUp);
            this.player1.clickCard(this.quant);

            this.player1.endTurn();
            expect(this.quant.location).toBe('play area');
        });
    });
});
