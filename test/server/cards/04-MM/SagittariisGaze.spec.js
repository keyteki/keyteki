describe("Sagittarii's Gaze", function () {
    describe("Sagittarii's Gaze's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['dark-centurion'],
                    hand: ['sagittarii-s-gaze']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('should be able to select a creature with damage', function () {
            this.darkCenturion.tokens.damage = 1;
            this.troll.tokens.damage = 1;

            this.player1.play(this.sagittariiSGaze);

            expect(this.player1).toBeAbleToSelect(this.darkCenturion);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);

            expect(this.lamindra.amber).toBe(0);
            expect(this.troll.amber).toBe(1);
            expect(this.darkCenturion.amber).toBe(0);
        });
    });
});
