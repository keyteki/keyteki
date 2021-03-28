describe('Rapid Evolution', function () {
    describe("Rapid Evolution's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['rapid-evolution']
                },
                player2: {
                    amber: 2,
                    inPlay: ['odoac-the-patrician']
                }
            });
        });

        it('should give a creature, 4 power counters', function () {
            this.player1.play(this.rapidEvolution);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.odoacThePatrician);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.power).toBe(5);
            expect(this.odoacThePatrician.tokens.power).toBeUndefined();
        });
    });
});
