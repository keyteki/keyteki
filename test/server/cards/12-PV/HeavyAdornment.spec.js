describe('Heavy Adornment', function () {
    describe("Heavy Adornment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['heavy-adornment'],
                    inPlay: ['ember-imp', 'corrosive-monk', 'krump']
                },
                player2: {
                    inPlay: ['ancient-bear', 'dust-pixie']
                }
            });
        });

        it('should exalt neighbors when the attached creature reaps', function () {
            this.player1.playUpgrade(this.heavyAdornment, this.corrosiveMonk);
            this.player1.reap(this.corrosiveMonk);
            expect(this.emberImp.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            expect(this.corrosiveMonk.amber).toBe(0);
            expect(this.ancientBear.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
