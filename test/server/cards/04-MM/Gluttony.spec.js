describe('Guttony', function () {
    describe("Guttony's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['sloth', 'gub', 'desire', 'envy', 'pride', 'bad-penny'],
                    hand: ['gluttony'],
                    amber: 1
                },
                player2: {
                    amber: 2,
                    inPlay: ['wrath']
                }
            });

            this.gub.tokens.amber = 2;
            this.pride.tokens.amber = 1;
        });

        it('should exalt Gluttony for each sin creature in play', function () {
            this.player1.play(this.gluttony);
            expect(this.gluttony.amber).toBe(5);
        });

        it('should move amber from each creature with amber to their pool', function () {
            this.player1.play(this.gluttony);
            expect(this.gub.amber).toBe(2);
            expect(this.pride.amber).toBe(1);
            expect(this.gluttony.amber).toBe(5);

            this.gluttony.exhausted = false;
            this.player1.reap(this.gluttony);
            expect(this.gub.amber).toBe(0);
            expect(this.pride.amber).toBe(0);
            expect(this.gluttony.amber).toBe(0);
            expect(this.player1.amber).toBe(10);
        });
    });
});
