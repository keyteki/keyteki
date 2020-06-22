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

            expect(this.umbra.hasToken('amber')).toBe(false);
            expect(this.umbra.hasToken('ward')).toBe(false);
            expect(this.darkCenturion.hasToken('ward')).toBe(false);
        });

        it('should be able to remove one amber from a creature that this player controls, and ward it', function () {
            this.umbra.tokens.amber = 1;
            this.player1.useAction(this.darkCenturion);

            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.umbra);

            expect(this.umbra.hasToken('amber')).toBe(false);
            expect(this.umbra.hasToken('ward')).toBe(true);
            expect(this.darkCenturion.hasToken('ward')).toBe(false);
        });

        it('should be able to remove one amber from a creature that the opponent controls, and ward it', function () {
            this.umbra.tokens.amber = 1;
            this.troll.tokens.amber = 1;

            this.player1.useAction(this.darkCenturion);

            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);

            expect(this.umbra.hasToken('amber')).toBe(true);
            expect(this.umbra.hasToken('ward')).toBe(false);

            expect(this.troll.hasToken('amber')).toBe(false);
            expect(this.troll.hasToken('ward')).toBe(true);
        });
    });
});
