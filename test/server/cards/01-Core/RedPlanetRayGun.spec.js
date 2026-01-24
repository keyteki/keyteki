describe('Red Planet Ray Gun', function () {
    describe("Red Planet Ray Gun's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['red-planet-ray-gun'],
                    inPlay: ['zorg', 'collector-worm']
                },
                player2: {
                    inPlay: ['bumpsy', 'yxili-marauder']
                }
            });
        });

        it('should deal damage equal to the number of Mars creatures in play', function () {
            this.player1.playUpgrade(this.redPlanetRayGun, this.zorg);
            this.player1.reap(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.yxiliMarauder);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
