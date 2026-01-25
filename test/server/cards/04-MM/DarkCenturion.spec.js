describe('dark-centurion', function () {
    describe("Dark Centurion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['umbra', 'dark-centurion'],
                    hand: ['access-denied']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should be able to select a creature without amber and not ward it', function () {
            this.player1.useAction(this.darkCenturion);

            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.umbra);

            expect(this.umbra.amber).toBe(0);
            expect(this.umbra.warded).toBe(false);
            expect(this.darkCenturion.warded).toBe(false);
        });

        it('should be able to remove one amber from a creature that this player controls, and ward it', function () {
            this.umbra.amber = 1;
            this.player1.useAction(this.darkCenturion);

            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.umbra);

            expect(this.umbra.amber).toBe(0);
            expect(this.umbra.warded).toBe(true);
            expect(this.darkCenturion.warded).toBe(false);
        });

        it('should be able to remove one amber from a creature that the opponent controls, and ward it', function () {
            this.umbra.amber = 1;
            this.troll.amber = 1;

            this.player1.useAction(this.darkCenturion);

            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);

            expect(this.umbra.amber).toBe(1);
            expect(this.umbra.warded).toBe(false);

            expect(this.troll.amber).toBe(0);
            expect(this.troll.warded).toBe(true);
        });
    });
});
