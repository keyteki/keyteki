describe('The Callipygian Ideal', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'saurian',
                    inPlay: ['troll'],
                    hand: ['the-callipygian-ideal']
                },
                player2: {
                    inPlay: ['the-sting'],
                    hand: ['urchin']
                }
            });

            this.player1.playUpgrade(this.theCallipygianIdeal, this.troll);
        });

        it('should exalt the creature it is attached to', function () {
            expect(this.troll.tokens.amber).toBe(1);
        });

        describe('and the next turn begins', function () {
            beforeEach(function () {
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
            });

            it('should prompt the forge key prompt', function () {
                expect(this.player1).toHavePrompt('Which key would you like to forge?');
            });
        });

        describe('and would win the game', function () {
            beforeEach(function () {
                this.player1.player.keys = { red: true, yellow: true, blue: false };
                this.troll.tokens.amber = 3;
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
            });

            it('should prompt the player correctly', function () {
                expect(this.player1).toHavePrompt('How much amber do you want to use from Troll?');
                expect(this.player1).toHavePromptButton(1);
                expect(this.player1).toHavePromptButton(2);
                expect(this.player1).toHavePromptButton(3);
            });

            it('should indicate the player has won', function () {
                this.player1.clickPrompt(1);
                expect(this.player1).toHavePrompt('player1 has won the game!');
            });
        });
    });
});
