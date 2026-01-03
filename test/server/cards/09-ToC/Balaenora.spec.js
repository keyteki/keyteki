describe('Balaenora', function () {
    describe("Balaenora's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['balaenora']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not be playable if opponent has less than 7 amber', function () {
            this.player1.clickCard(this.balaenora);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be playable if opponent has at least 7 amber, and should capture it all', function () {
            this.player2.amber = 7;
            this.player1.playCreature(this.balaenora);
            expect(this.balaenora.amber).toBe(7);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should give control on fight', function () {
            this.player2.amber = 7;
            this.player1.playCreature(this.balaenora);
            this.balaenora.exhausted = false;
            this.player1.fightWith(this.balaenora, this.lamindra);
            this.player1.clickPrompt('Right');
            expect(this.balaenora.controller).toBe(this.player2.player);
            expect(this.player2.player.creaturesInPlay).toContain(this.balaenora);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
