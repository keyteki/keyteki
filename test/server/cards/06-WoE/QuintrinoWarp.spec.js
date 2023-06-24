describe('Quintrino Warp', function () {
    describe("Quintrino Warp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['krump', 'diplomat-agung', 'batdrone'],
                    hand: ['quintrino-warp']
                },
                player2: {
                    inPlay: ['bumpsy', 'urchin', 'dust-pixie', 'dodger']
                }
            });
        });

        it('should destroy all creatures with the chosen houses', function () {
            this.player1.play(this.quintrinoWarp);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.diplomatAgung.location).toBe('play area');
            expect(this.batdrone.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy all creatures with the multiple houses', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('untamed');
            this.player1.clickCard(this.krump);
            this.player1.play(this.quintrinoWarp);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.diplomatAgung.location).toBe('play area');
            expect(this.batdrone.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
