describe('Dr Xyloxxzlphrex', function () {
    describe("Dr Xyloxxzlphrex's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['dr-xyloxxzlphrex'],
                    discard: [
                        'airlock',
                        'blypyp',
                        'extinction',
                        'jammer-pack',
                        'mindwarper',
                        'troll'
                    ]
                }
            });
        });

        it('a mars creature from discard enters play ready', function () {
            this.player1.reap(this.drXyloxxzlphrex);
            expect(this.player1).toHavePrompt('Dr. Xyloxxzlphrex');
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.airlock);
            expect(this.player1).not.toBeAbleToSelect(this.extinction);
            expect(this.player1).not.toBeAbleToSelect(this.jammerPack);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Left');
            expect(this.blypyp.location).toBe('play area');
            expect(this.blypyp.exhausted).toBe(false);

            expect(this.airlock.location).toBe('discard');
            expect(this.extinction.location).toBe('discard');
            expect(this.jammerPack.location).toBe('discard');
            expect(this.mindwarper.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
        });
    });
});
