describe('Ready Messages', function () {
    describe('ready a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ghoul-keeping'],
                    inPlay: ['helichopper']
                },
                player2: {}
            });
            this.helichopper.exhausted = true;
        });

        it('should log correct message when readying a creature', function () {
            this.player1.play(this.ghoulKeeping);
            this.player1.clickCard(this.helichopper);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ghoul-keeping',
                "player1 gains an amber due to Ghoul-keeping's bonus icon",
                'player1 uses Ghoul-keeping to ready a friendly Geistoid creature.'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
