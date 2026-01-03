describe('Marketeer', function () {
    describe("Marketeer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'marketeer',
                    inPlay: ['marketeer:toad', 'bux-bastian']
                },
                player2: {
                    amber: 2
                }
            });

            this.marketeer1 = this.player1.player.creaturesInPlay[0];
        });

        it('should do nothing without blue key forged', function () {
            this.player1.clickCard(this.marketeer1);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Cancel');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain 2 and destroy self with the blue key forged', function () {
            this.player1.player.keys = { red: false, blue: true, yellow: false };
            this.player1.reap(this.buxBastian); // force re-scan of keys
            this.buxBastian.exhausted = false;
            this.player1.useAction(this.marketeer1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.marketeer1.location).toBe('discard');
            this.player1.clickCard(this.buxBastian);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Cancel');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
