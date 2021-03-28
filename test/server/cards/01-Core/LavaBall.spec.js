describe('Lava Ball', function () {
    describe("Lava Ball's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['lava-ball']
                },
                player2: {
                    inPlay: ['snufflegator', 'ancient-bear', 'hunting-witch']
                }
            });
        });

        it('should deal 4 damage with 2 splash', function () {
            this.player1.play(this.lavaBall);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.tokens.damage).toBe(4);
            expect(this.snufflegator.tokens.damage).toBe(2);
            expect(this.huntingWitch.location).toBe('discard');
        });
    });
});
