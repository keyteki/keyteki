describe('Addlefish', function () {
    describe("Addlefish's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['addlefish']
                },
                player2: {
                    hand: ['mind-barb', 'gateway-to-dis'],
                    inPlay: ['dust-imp']
                }
            });
        });

        it('should cause opponent to discard 2 random cards on fight', function () {
            this.player1.fightWith(this.addlefish, this.dustImp);
            expect(this.mindBarb.location).toBe('discard');
            expect(this.gatewayToDis.location).toBe('discard');
        });
    });
});
