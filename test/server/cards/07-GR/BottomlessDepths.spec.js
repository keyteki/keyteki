describe('Bottomless Depths', function () {
    describe("Bottomless Depth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['crushing-deep'],
                    inPlay: ['bottomless-depths']
                },
                player2: {
                    hand: ['punctuated-equilibrium']
                }
            });
        });

        it('puts discarded cards under itself', function () {
            this.player1.clickCard(this.crushingDeep);
            this.player1.clickPrompt('Discard this card');
            expect(this.crushingDeep.location).toBe('under');
            expect(this.bottomlessDepths.childCards.length).toBe(1);
            expect(this.bottomlessDepths.childCards).toContain(this.crushingDeep);
            expect(this.player1.player.discard.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('works on opponent turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            this.player2.clickPrompt('Autoresolve');
            expect(this.crushingDeep.location).toBe('under');
            expect(this.bottomlessDepths.childCards.length).toBe(6);
            expect(this.bottomlessDepths.childCards).toContain(this.crushingDeep);
            expect(this.player1.player.discard.length).toBe(0);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
