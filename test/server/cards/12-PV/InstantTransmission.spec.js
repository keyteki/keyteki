describe('Instant Transmission', function () {
    describe("Instant Transmission's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['instant-transmission'],
                    hand: ['poke']
                },
                player2: {
                    hand: ['krump']
                }
            });
        });

        it('should draw 3 cards and destroy itself when used', function () {
            const player1Hand = this.player1.hand.length;
            this.player1.useAction(this.instantTransmission, true);
            expect(this.player1.hand.length).toBe(player1Hand + 3);
            expect(this.instantTransmission.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
