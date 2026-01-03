describe('Jammer Pack', function () {
    describe("Jammer Pack's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['jammer-pack'],
                    inPlay: ['mindwarper']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });

        it('should increase opponent key cost by 2 when attached', function () {
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.playUpgrade(this.jammerPack, this.mindwarper);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
