describe("Gizelhart's Standard", function () {
    describe("Gizelhart's Standard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['mother-northelle', 'troll'],
                    hand: ['gizelhart-s-standard']
                },
                player2: {
                    inPlay: ['collector-worm', 'angwish']
                }
            });
        });

        it('should exalt a friendly creature when played and increase its armor', function () {
            this.player1.moveCard(this.gizelhartSStandard, 'hand');
            this.player1.play(this.gizelhartSStandard);
            expect(this.player1).toBeAbleToSelect(this.motherNorthelle);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).not.toBeAbleToSelect(this.angwish);
            this.player1.clickCard(this.motherNorthelle);
            expect(this.motherNorthelle.tokens.amber).toBe(1);
            expect(this.motherNorthelle.armor).toBe(1);
        });
    });
});
