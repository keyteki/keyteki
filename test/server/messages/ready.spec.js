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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ghoul-keeping',
                "player1 gains an amber due to Ghoul-keeping's bonus icon",
                'player1 uses Ghoul-keeping to ready a friendly Geistoid creature.'
            ]);
        });
    });

    describe('ready phase with entrench', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['grammy-taps']
                },
                player2: {}
            });
            this.grammyTaps.exhaust();
            this.player1.endTurn();
        });

        it('should log correct message when readying entrenched creatures', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickCard(this.grammyTaps);
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 readies their cards',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses shadows as their active house this turn'
            ]);
        });

        it('should log correct message when leaving entrenched creatures exhausted', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses shadows as their active house this turn'
            ]);
        });
    });
});
