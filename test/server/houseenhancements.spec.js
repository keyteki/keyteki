describe('house enhancements', function () {
    describe('House Enhancements', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['daughter', 'medic-ingram'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    hand: ['grand-alliance-council'],
                    inPlay: ['cpo-zytar']
                }
            });
        });

        it('can play/use cards with house enhancements', function () {
            this.daughter.enhancements = ['capture', 'staralliance'];

            // Can play as enhanced house.
            this.player1.playCreature(this.daughter);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Can use as enhanced house.
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.daughter);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Can still use as original house.
            this.player1.clickPrompt('logos');
            this.player1.reap(this.daughter);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();

            // Counts as other houses.
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.grandAllianceCouncil);
            expect(this.player2).toHavePrompt('Choose a Logos creature to not destroy');
            expect(this.player2).toBeAbleToSelect(this.helperBot);
            expect(this.player2).toBeAbleToSelect(this.daughter);
            this.player2.clickCard(this.daughter);
            expect(this.player2).toHavePrompt('Choose a Star Alliance creature to not destroy');
            expect(this.player2).toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).toBeAbleToSelect(this.daughter);
            this.player2.clickCard(this.daughter);
            expect(this.helperBot.location).toBe('discard');
            expect(this.daughter.location).toBe('play area');
            expect(this.cpoZytar.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('can call house from enhancement even if not in deck houses', function () {
            this.cpoZytar.enhancements = ['saurian'];
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
