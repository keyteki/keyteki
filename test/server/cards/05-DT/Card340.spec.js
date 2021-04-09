describe('Card 340', function () {
    describe("Card 340's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['stealer-of-souls', 'screaming-cave']
                },
                player2: {
                    inPlay: ['card-340', 'card-340']
                }
            });
        });

        it('should stack', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(4);
        });
    });
});
