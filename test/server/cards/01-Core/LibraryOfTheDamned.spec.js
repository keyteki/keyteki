describe('Library of the Damned', function () {
    describe("Library of the Damned's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['ember-imp', 'shooler'],
                    inPlay: ['library-of-the-damned']
                },
                player2: {}
            });
        });

        it('should archive a card from hand on action', function () {
            this.player1.useAction(this.libraryOfTheDamned);
            expect(this.player1).toHavePrompt('Library of the Damned');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
