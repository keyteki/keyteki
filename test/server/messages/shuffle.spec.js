describe('Shuffle Messages', function () {
    describe('shuffle into deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mab-the-mad']
                },
                player2: {}
            });
        });

        it('should log correct message when shuffling card into deck', function () {
            this.player1.reap(this.mabTheMad);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Mab the Mad to reap with Mab the Mad',
                "player1 uses Mab the Mad to return Mab the Mad to their owner's deck"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('shuffle discard into deck at end of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    discard: ['dextre', 'library-access', 'phase-shift']
                },
                player2: {}
            });
        });

        it('should log correct message when shuffling discard into deck at end of turn', function () {
            this.player1.player.deck = [];
            this.player1.endTurn();
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to their maximum of 6',
                "player1's deck has run out of cards, so they shuffle",
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber '
            ]);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });
    });

    describe('shuffle discard into deck mid-turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['timetraveller'],
                    discard: ['dextre', 'library-access', 'phase-shift']
                },
                player2: {}
            });
        });

        it('should log correct message when action causes draw from empty deck', function () {
            this.player1.player.deck = [];
            this.player1.play(this.timetraveller);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Timetraveller',
                "player1 gains an amber due to Timetraveller's bonus icon",
                'player1 uses Timetraveller to draw 2 cards',
                'player1 draws 2 cards',
                "player1's deck has run out of cards, so they shuffle"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
