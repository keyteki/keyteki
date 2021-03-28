describe('Brain Stem Antenna', function () {
    describe("Brain Stem Antenna's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['brain-stem-antenna', 'mindwarper'],
                    inPlay: ['yxilx-dominator', 'silvertooth']
                },
                player2: {
                    inPlay: ['doc-bookton']
                }
            });
        });

        it('should ready the creature', function () {
            this.player1.reap(this.yxilxDominator);
            this.player1.playUpgrade(this.brainStemAntenna, this.yxilxDominator);
            this.player1.play(this.mindwarper);
            expect(this.yxilxDominator.exhausted).toBe(false);
        });

        it('should give the creature mars affiliation', function () {
            this.player1.playUpgrade(this.brainStemAntenna, this.silvertooth);
            this.player1.play(this.mindwarper);
            expect(this.silvertooth.hasHouse('mars')).toBe(true);
        });
    });
});
