describe('Punctuated Equilibrium', function() {
    integration(function() {
        describe('Punctuated Equilibrium\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        hand: ['bigtwig', 'snufflegator','punctuated-equilibrium']
                    },
                    player2: {
                        hand: ['sequis', 'raiding-knight']
                    }
                });
            });

            it('causes players to empty their hands and draw back up to 6', function() {
                this.player1.play(this.punctuatedEquilibrium);
                expect(this.bigtwig.location).toBe('discard');
                expect(this.snufflegator.location).toBe('discard');
                expect(this.sequis.location).toBe('discard');
                expect(this.raidingKnight.location).toBe('discard');
                expect(this.player1.hand.length).toBe(6);
                expect(this.player2.hand.length).toBe(6);
            });
            it('causes players with chains to draw to their max hand size and shed a chain', function() {
                this.player1.chains = 1;
                this.player2.chains = 2;
                this.player1.play(this.punctuatedEquilibrium);
                expect(this.bigtwig.location).toBe('discard');
                expect(this.snufflegator.location).toBe('discard');
                expect(this.sequis.location).toBe('discard');
                expect(this.raidingKnight.location).toBe('discard');
                expect(this.player1.hand.length).toBe(5);
                expect(this.player2.hand.length).toBe(5);
                expect(this.player1.chains).toBe(0);
                expect(this.player2.chains).toBe(1);
            });
        });
    });
});
