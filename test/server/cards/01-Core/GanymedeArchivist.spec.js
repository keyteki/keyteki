describe('Ganymede Archivist', function () {
    describe("Ganymede Archivist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ganymede-archivist'],
                    hand: ['dextre']
                },
                player2: {}
            });
        });

        it('should archive a card from hand when reaping', function () {
            this.player1.reap(this.ganymedeArchivist);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ganymede Archivist's ability with no cards in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ganymede-archivist'],
                    hand: []
                },
                player2: {}
            });
        });

        it('should not prompt when there are no cards in hand', function () {
            this.player1.reap(this.ganymedeArchivist);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
