describe('The Promised Blade', function () {
    describe("The Promised Blade's ability", function () {
        describe('when players have a different amount of creatures', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'baldric-the-bold',
                            'pandulf-the-provoker',
                            'challe-the-safeguard',
                            'the-promised-blade'
                        ]
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['tyxl-beambuckler'],
                        hand: ['myx-the-tallminded', 'xanthyx-harvester']
                    }
                });
            });

            it('should automatically move to the player with the fewest number of creatures at the start of each turn', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                expect(this.thePromisedBlade.controller).toBe(this.player2.player);
            });

            it('has an omni to capture 1', function () {
                this.player1.useAction(this.thePromisedBlade, true);
                this.player1.clickCard(this.baldricTheBold);
                expect(this.baldricTheBold.tokens.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
            });
        });

        describe('when players have the same number of creatures', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'baldric-the-bold',
                            'pandulf-the-provoker',
                            'challe-the-safeguard',
                            'the-promised-blade'
                        ]
                    },
                    player2: {
                        inPlay: ['tyxl-beambuckler'],
                        hand: ['myx-the-tallminded', 'xanthyx-harvester']
                    }
                });
            });

            it("should give a prompt to select between players if there's a tie for fewest creatures", function () {
                this.player1.endTurn();
                expect(this.thePromisedBlade.controller).toBe(this.player2.player); // player 2 has fewer creatures, they get the blade at start of turn
                this.player2.clickPrompt('mars');
                this.player2.play(this.myxTheTallminded);
                this.player2.play(this.xanthyxHarvester);
                this.player2.endTurn();
                expect(this.player1).toHavePrompt('The Promised Blade'); // same number of creatures now, active player chooses
                this.player1.clickPrompt('Me');
                expect(this.thePromisedBlade.controller).toBe(this.player1.player);
            });
        });
    });
});
