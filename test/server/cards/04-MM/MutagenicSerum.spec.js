describe('Mutagenic Serum', function () {
    describe("Mutagenic Serum's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'mutagenic-serum',
                        'ardent-hero',
                        'dextre',
                        'scrivener-favian',
                        'bull-wark'
                    ]
                },
                player2: {
                    inPlay: ['dust-imp']
                }
            });
        });

        it('should allow using mutant creatures', function () {
            this.player1.useAction(this.mutagenicSerum, true);
            expect(this.mutagenicSerum.location).toBe('discard');
            this.player1.reap(this.dextre);
            this.player1.reap(this.scrivenerFavian);
            this.player1.fightWith(this.bullWark, this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
        });
    });
});
