describe('Scooboo', function () {
    describe("Scooboo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    discard: ['scooboo', 'flaxia']
                },
                player2: {
                    hand: ['punctuated-equilibrium']
                }
            });
            this.player1.moveCard(this.flaxia, 'deck');
        });

        it('can replace the first card draw at the end of your turn', function () {
            this.player1.endTurn();
            this.player1.clickCard(this.scooboo);
            expect(this.scooboo.location).toBe('hand');
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.flaxia.location).toBe('discard');
            this.player2.clickPrompt('untamed');
        });

        it('can replace the second card draw at the end of your turn', function () {
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.scooboo);
            expect(this.scooboo.location).toBe('hand');
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.flaxia.location).toBe('hand');
            this.player2.clickPrompt('untamed');
        });

        it('still causes a chain to be shed', function () {
            this.player1.chains = 2;
            this.player1.endTurn();
            this.player1.clickCard(this.scooboo);
            expect(this.scooboo.location).toBe('hand');
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.chains).toBe(1);
            this.player2.clickPrompt('untamed');
        });

        it('does nothing if in play', function () {
            this.player1.moveCard(this.scooboo, 'hand');
            this.player1.playCreature(this.scooboo);
            this.player1.endTurn();
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('untamed');
        });

        it('does nothing on opponent turn', function () {
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.scooboo.location).toBe('discard');
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            expect(this.player1.player.discard.length).toBe(7);
            expect(this.player1.player.hand.length).toBe(6);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
