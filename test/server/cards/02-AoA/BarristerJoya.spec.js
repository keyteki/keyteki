describe('Barrister Joya', function () {
    describe("Barrister Joya's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['barrister-joya']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should prevent enemy creatures from reaping', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Fight with this creature');
            this.player2.clickCard(this.barristerJoya);
            this.player2.clickCard(this.krump);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Reap with this creature');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
