describe('Garnet Squire', function () {
    describe("Garnet Squire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['garnet-squire']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('should heal 1 damage and gain 1 amber at end of turn', function () {
            this.garnetSquire.tokens.damage = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.garnetSquire.damage).toBe(0);
            expect(this.player1.amber).toBe(1);
        });

        it('should heal only 1 damage and gain 1 amber at end of turn', function () {
            this.garnetSquire.tokens.damage = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.garnetSquire.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
        });

        it('should not gain amber if no damage to heal', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.garnetSquire.damage).toBe(0);
            expect(this.player1.amber).toBe(0);
        });
    });
});
