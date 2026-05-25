describe('The Watch', function () {
    describe("The Watch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    inPlay: ['the-watch']
                },
                player2: {
                    hand: ['urchin']
                }
            });
        });

        it('prevents amber from being stolen while exhausted', function () {
            this.theWatch.exhausted = true;
            this.player1.endTurn();
            this.player1.clickCard(this.theWatch);
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('allows amber to be stolen while ready', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
