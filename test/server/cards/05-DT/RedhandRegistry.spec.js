describe('Redhand Registry', function () {
    describe("Redhand Registry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['dust-pixie', 'ronnie-wristclocks'],
                    inPlay: ['redhand-registry']
                },
                player2: {
                    amber: 1,
                    hand: ['gub', 'krump', 'urchin'],
                    inPlay: []
                }
            });
        });

        it('should not skip forge a key step if they stole amber', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.amber = 10;
            this.player2.playCreature(this.urchin, true);
            expect(this.player2.amber).toBe(11);
            this.player2.endTurn();

            this.player1.clickPrompt('untamed');
            this.player1.endTurn();

            // should forge here, but can't because it is blocked.
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player2.amber).toBe(11);

            this.player1.clickPrompt('untamed');
            this.player1.endTurn();

            // now can forge
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            expect(this.player2.amber).toBe(5);
        });

        it('make sure when controller steals it does not block their forging', function () {
            this.player1.amber = 10;
            this.player1.playCreature(this.ronnieWristclocks, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
        });
    });
});
