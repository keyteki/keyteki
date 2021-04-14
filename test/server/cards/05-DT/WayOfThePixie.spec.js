describe('Way Of The Pixie', function () {
    describe("Way Of The Pixie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['way-of-the-pixie'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should have tests', function () {
            this.player1.playUpgrade(this.wayOfThePixie, this.flaxia);
            expect(this.player1.amber).toBe(1);
            this.player1.reap(this.flaxia);
            expect(this.player1.amber).toBe(3);
        });
    });
});
