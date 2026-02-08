describe('Archive Messages', function () {
    describe('archive from hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['information-officer-gray', 'troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving a card', function () {
            this.player1.play(this.informationOfficerGray);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Information Officer Gray',
                'player1 uses Information Officer Gray to reveal Troll from their hand, and archive it'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('archive from deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['zyx-researcher'],
                    deck: ['troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving from deck', function () {
            this.player1.play(this.zyxResearcher);
            this.player1.clickPrompt('Deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Z.Y.X. Researcher',
                "player1 chooses option 'Deck'",
                'player1 uses Z.Y.X. Researcher to archive a card'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('archive from discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['novu-archaeologist'],
                    discard: ['troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving from discard', function () {
            this.player1.useAction(this.novuArchaeologist);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Novu Archaeologist to archive Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
