describe('Subtle Maul', function () {
    describe("Subtle Maul's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['subtle-maul']
                },
                player2: {
                    hand: ['lamindra', 'batdrone', 'urchin']
                }
            });
        });

        it('should make opponent discard a random card', function () {
            const handSize = this.player2.hand.length;
            this.player1.useAction(this.subtleMaul);
            expect(this.player2.hand.length).toBe(handSize - 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if opponent has no cards', function () {
            this.player2.moveCard(this.lamindra, 'discard');
            this.player2.moveCard(this.batdrone, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.useAction(this.subtleMaul);
            expect(this.player2.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
