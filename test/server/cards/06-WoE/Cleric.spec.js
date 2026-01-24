describe('Cleric', function () {
    describe("Cleric's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'cleric',
                    amber: 1,
                    inPlay: [],
                    hand: ['holdfast', 'mother-northelle', 'grey-augur']
                },
                player2: {
                    amber: 7,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should capture 1 when enters play', function () {
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            expect(this.player1.player.creaturesInPlay[0].amber).toBe(1);
            expect(this.player1.player.creaturesInPlay[1].amber).toBe(1);
        });
    });
});
