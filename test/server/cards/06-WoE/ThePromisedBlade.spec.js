describe('The Promised Blade', function () {
    describe("The Promised Blade's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'baldric-the-bold',
                        'pandulf-the-provoker',
                        'grey-abbess',
                        'the-promised-blade'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['blorb']
                }
            });
        });

        it("should move the player with the fewest number of creatures at the start of each player's turn", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            expect(this.thePromisedBlade.controller).toBe(this.player2.player);
        });

        it("should give a prompt to select between players if there's a tie for fewest creatures", function () {
            this.baldricTheBold.location = 'discard';
            this.greyAbbess.location = 'discard';
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('The Promised Blade');
            this.player2.clickPrompt('Me');
            expect(this.thePromisedBlade.controller).toBe(this.player2.player);
        });

        it('has an omni to capture 1', function () {
            this.player1.useAction(this.thePromisedBlade, true);
            this.player1.clickCard(this.baldricTheBold);
            expect(this.baldricTheBold.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
