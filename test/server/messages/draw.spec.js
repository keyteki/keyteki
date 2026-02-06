describe('Draw Messages', function () {
    describe('draw card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble']
                },
                player2: {}
            });
        });

        it('should log correct message when drawing a card', function () {
            this.player1.useAction(this.libraryOfBabble);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Library of Babble to draw 1 card',
                'player1 draws 1 card'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('draw multiple cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['timetraveller']
                },
                player2: {}
            });
        });

        it('should log correct message when drawing multiple cards', function () {
            this.player1.play(this.timetraveller);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Timetraveller',
                "player1 gains an amber due to Timetraveller's bonus icon",
                'player1 uses Timetraveller to draw 2 cards',
                'player1 draws 2 cards'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('refill hand at end of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift']
                },
                player2: {}
            });
        });

        it('should log correct message when refilling hand', function () {
            this.player1.play(this.phaseShift);
            this.player1.endTurn();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Phase Shift',
                'player1 uses Phase Shift to allow them to play one non-Logos card this turn',
                'player1 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber'
            ]);
        });
    });
});
