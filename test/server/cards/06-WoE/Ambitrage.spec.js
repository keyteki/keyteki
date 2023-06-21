describe('Ambitrage', function () {
    describe("Ambitrage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['æmbitrage']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('own key should cost +1', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it('should refill hand with +1 card', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(7);
        });
    });
});
