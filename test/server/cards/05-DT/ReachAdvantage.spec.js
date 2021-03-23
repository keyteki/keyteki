describe('Reach Advantage', function () {
    describe("Reach Advantage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['reach-advantage'],
                    inPlay: ['flaxia', 'glimmer']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('While tide is low', function () {
            it('should raise the tide', function () {
                this.player1.lowerTide();
                expect(this.player1.isTideLow()).toBe(true);
                this.player1.play(this.reachAdvantage);
                expect(this.player1.isTideHigh()).toBe(true);
            });
        });

        describe('While tide is neutral', function () {
            it('should raise the tide', function () {
                this.player1.play(this.reachAdvantage);
                expect(this.player1.isTideHigh()).toBe(true);
            });
        });

        describe('While tide is High', function () {
            it('should capture 3 onto selected creature', function () {
                this.player1.raiseTide();
                this.player1.play(this.reachAdvantage);

                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.glimmer);
                expect(this.player1).not.toBeAbleToSelect(this.gub);
                expect(this.player1).not.toBeAbleToSelect(this.krump);

                this.player1.clickCard(this.flaxia);

                expect(this.player2.amber).toBe(1);
                expect(this.flaxia.amber).toBe(3);
                expect(this.glimmer.amber).toBe(0);
            });
        });
    });
});
