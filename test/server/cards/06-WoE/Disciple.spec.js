describe('Disciple', function () {
    describe("Disciple's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'disciple',
                    amber: 1,
                    inPlay: ['disciple:curia-saurus'],
                    hand: ['holdfast', 'mother-northelle', 'grey-augur']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should get +1 power and armor for each monk neighbor', function () {
            this.player1.play(this.motherNorthelle);
            this.player1.play(this.greyAugur, true);
            expect(this.disciple.armor).toBe(2);
            expect(this.disciple.power).toBe(3);
        });

        it('should get no bonus from non-Monk neighbors', function () {
            this.player1.play(this.holdfast);
            expect(this.disciple.armor).toBe(0);
            expect(this.disciple.power).toBe(1);
        });
    });
});
