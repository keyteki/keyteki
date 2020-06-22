describe('Quant', function () {
    describe('when reaping', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['quant', 'troll'],
                    hand: ['anger', 'wild-wormhole', 'shadow-self']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('logos');
            this.player1.reap(this.quant);
        });

        it('should allow a non logos action card to be played', function () {
            expect(this.player1).toBeAbleToPlay(this.anger);
        });

        it('should not allow a non-logos creature card to be played', function () {
            expect(this.player1).not.toBeAbleToPlay(this.shadowSelf);
        });
    });
});
