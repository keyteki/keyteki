describe('Saury About That', function () {
    describe("Saury About That' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [],
                    hand: ['saury-about-that']
                },
                player2: {
                    inPlay: []
                }
            });
        });
        it('should not gain amber when there is no creature in play', function () {
            this.player1.play(this.sauryAboutThat);

            expect(this.player1.amber).toBe(0);
        });
    });

    describe("Saury About That' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll'],
                    hand: ['saury-about-that']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });
        it('should make player 1 gain 1 amber', function () {
            this.player1.play(this.sauryAboutThat);

            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);

            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
        it('should make player 2 gain 1 amber', function () {
            this.player1.play(this.sauryAboutThat);

            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);

            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });
});
