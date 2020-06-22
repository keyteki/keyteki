describe('Phase Shift', function () {
    describe("Phase Shift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift', 'virtuous-works', 'wild-wormhole', 'punch']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
            this.player1.play(this.phaseShift);
        });

        it('should allow playing a non-logos card', function () {
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toBeAbleToPlay(this.virtuousWorks);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).not.toBeAbleToPlay(this.punch);
        });

        it('should stack', function () {
            this.player1.moveCard(this.phaseShift, 'hand');
            this.player1.play(this.phaseShift);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toBeAbleToPlay(this.virtuousWorks);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.punch);
            expect(this.player1).toHavePrompt('Punch');
        });

        it('should not carry over to the following turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).not.toBeAbleToPlay(this.virtuousWorks);
            expect(this.player1.amber).toBe(0);
        });

        it('should not be used up by Wild Wormhole', function () {
            this.player1.moveCard(this.virtuousWorks, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toBeAbleToPlay(this.punch);
        });
    });
});
