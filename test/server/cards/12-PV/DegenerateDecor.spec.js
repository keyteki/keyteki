describe('Degenerate Decor', function () {
    describe("Degenerate Decor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['degenerate-decor'],
                    inPlay: ['raiding-knight', 'angwish', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should exalt the most powerful creature 3 times', function () {
            this.player1.play(this.degenerateDecor);
            this.player1.clickPrompt('Exalt 3 times');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.angwish);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.amber).toBe(3);
            expect(this.angwish.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make the most powerful friendly creature capture 3 amber', function () {
            this.player1.moveCard(this.angwish, 'hand');
            this.player1.play(this.degenerateDecor);
            this.player1.clickPrompt('Capture 3');
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.tokens.amber).toBe(3);
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
