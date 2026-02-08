describe('Action Ability Messages', function () {
    describe('Action: on artifact', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble']
                },
                player2: {}
            });
        });

        it('should log correct message when using artifact Action ability', function () {
            this.player1.useAction(this.libraryOfBabble);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Library of Babble to draw 1 card',
                'player1 draws 1 card'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Action: on creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['pit-demon']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should log correct message when using creature Action ability', function () {
            this.player1.useAction(this.pitDemon);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Pit Demon to steal 1 amber from player2'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
