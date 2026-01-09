describe('Novu Archaeologist', function () {
    describe("Novu Archaeologist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['novu-archaeologist'],
                    discard: ['dust-pixie', 'library-access']
                },
                player2: {}
            });
        });

        it('should archive a card from discard pile on action', function () {
            this.player1.clickCard(this.novuArchaeologist);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Novu Archaeologist');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.libraryAccess);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
