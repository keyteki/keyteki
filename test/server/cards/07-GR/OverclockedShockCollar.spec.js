describe('Overclocked Shock Collar', function () {
    describe("Overclocked Shock Collar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['overclocked-shock-collar'],
                    inPlay: ['john-smyth', 'tunk', 'flaxia']
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'groke', 'ironyx-rebel']
                }
            });
            this.johnSmyth.stun();
            this.tunk.stun();
            this.flaxia.stun();
        });

        it('should stun creature and neighbors on reap when attached', function () {
            this.player1.playUpgrade(this.overclockedShockCollar, this.groggins);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.groggins);
            expect(this.troll.stunned).toBe(true);
            expect(this.groggins.stunned).toBe(true);
            expect(this.groke.stunned).toBe(true);
            expect(this.ironyxRebel.stunned).toBe(false);
            this.expectReadyToTakeAction(this.player2);
        });

        it('unstun all mars creatures on scrap', function () {
            this.groke.stun();
            this.ironyxRebel.stun();
            this.player1.scrap(this.overclockedShockCollar);
            expect(this.groke.stunned).toBe(true);
            expect(this.ironyxRebel.stunned).toBe(false);
            expect(this.johnSmyth.stunned).toBe(false);
            expect(this.tunk.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
