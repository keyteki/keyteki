describe('Genetic Drift', function () {
    describe("Genetic Drift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['genetic-drift'],
                    inPlay: ['flaxia', 'bumblebird']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.flaxia.powerCounters = 2;
            this.gub.powerCounters = 1;
            this.player1.play(this.geneticDrift);
        });

        it('should be able to choose any creature', function () {
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
        });

        describe('and a creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.bumblebird);
            });

            it('should give this creature a +1 power token and +1 power token to exch creature with power tokens', function () {
                expect(this.flaxia.powerCounters).toBe(3);
                expect(this.bumblebird.powerCounters).toBe(2);
                expect(this.gub.powerCounters).toBe(2);
                expect(this.krump.powerCounters).toBe(0);
            });
        });
    });
});
