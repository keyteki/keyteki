describe('Niffle Ape', function () {
    describe("Niffle Ape's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['niffle-ape']
                },
                player2: {
                    inPlay: ['champion-anaphiel', 'urchin']
                }
            });
        });

        it('should allow attacking through taunt, and should avoid elusive', function () {
            this.player1.fightWith(this.niffleApe, this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.niffleApe.tokens.damage).toBe(1);
        });
    });
});
