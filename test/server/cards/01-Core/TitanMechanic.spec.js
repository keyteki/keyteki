describe('Titan Mechanic', function () {
    describe("Titan Mechanic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 5,
                    hand: ['mother'],
                    inPlay: ['batdrone', 'titan-mechanic']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should reduce key cost by 1 for both players when on flank', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(5);
            expect(this.player2.player.getCurrentKeyCost()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not reduce key cost when not on flank', function () {
            this.player1.playCreature(this.mother);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
