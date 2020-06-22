describe('Succubus', function () {
    describe("Succubus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['stealer-of-souls', 'screaming-cave']
                },
                player2: {
                    inPlay: ['succubus', 'succubus']
                }
            });
        });

        it('should stack', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(4);
        });
    });
});
