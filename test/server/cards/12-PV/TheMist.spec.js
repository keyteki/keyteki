describe('The Mist', function () {
    describe("The Mist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    inPlay: ['the-mist', 'ember-imp', 'yurk']
                },
                player2: {
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should destroy itself and give all creatures the Mutant trait', function () {
            this.player1.useAction(this.theMist, true);
            expect(this.theMist.location).toBe('discard');
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.yurk.hasTrait('mutant')).toBe(true);
            expect(this.flaxia.hasTrait('mutant')).toBe(true);
            expect(this.searine.hasTrait('mutant')).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should last until end of turn', function () {
            this.player1.useAction(this.theMist, true);
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.emberImp.hasTrait('mutant')).toBe(false);
            expect(this.flaxia.hasTrait('mutant')).toBe(false);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
