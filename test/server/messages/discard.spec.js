describe('Discard Messages', function () {
    describe('discard card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['troll'],
                    inPlay: ['feeding-pit']
                },
                player2: {}
            });
        });

        it('should log correct message when discarding a card', function () {
            this.player1.useAction(this.feedingPit);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Feeding Pit',
                'player1 uses Feeding Pit to discard Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('scrap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['donor-vox'],
                    inPlay: ['zorg']
                },
                player2: {}
            });
        });

        it('should log correct message when using scrap ability', function () {
            this.player1.scrap(this.donorVox);
            this.player1.clickCard(this.zorg);
            expect(this).toHaveAllChatMessagesBe([
                'player1 discards Donor Vox',
                'player1 uses Donor Vox to give Zorg two +1 power counters'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
