describe('Gateway to Dis', function () {
    describe("Gateway to Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['gateway-to-dis'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('should destroy all creatures and gain 3 chains', function () {
            this.player1.play(this.gatewayToDis);
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1.chains).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
