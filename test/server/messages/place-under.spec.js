describe('Place under Messages', function () {
    describe('place card under masterplan', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['masterplan', 'titan-mechanic']
                },
                player2: {}
            });
        });

        it('should log a facedown placeUnder message when playing masterplan', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Masterplan',
                "player1 uses Masterplan's amber bonus icon to gain 1 amber",
                'player1 uses Masterplan to place a card facedown under Masterplan'
            ]);
        });
    });

    describe('place card under cauldron', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['cauldron'],
                    discard: ['titan-mechanic']
                },
                player2: {}
            });
            this.player1.moveCard(this.titanMechanic, 'deck');
        });

        it('should log a faceup placeUnder message naming the card', function () {
            this.player1.useOmni(this.cauldron);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Cauldron to place Titan Mechanic faceup under Cauldron'
            ]);
        });
    });
});
