describe('Rumor-sower', function () {
    describe("Rumor-sower's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['rumor-sower', 'medic-ingram']
                },
                player2: {
                    inPlay: ['batdrone', 'cpo-zytar'],
                    discard: ['poke', 'stealth-mode', 'groke']
                }
            });
        });

        it('discards the top opponent card and stuns a creature', function () {
            this.player2.moveCard(this.poke, 'deck');
            this.player1.reap(this.rumorSower);
            expect(this.poke.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.rumorSower);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not allow stunning a friendly creature', function () {
            this.player2.moveCard(this.stealthMode, 'deck');
            this.player1.reap(this.rumorSower);
            expect(this.stealthMode.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.rumorSower);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.stunned).toBe(true);
            expect(this.medicIngram.stunned).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing if no matching creatures', function () {
            this.player2.moveCard(this.groke, 'deck');
            this.player1.reap(this.rumorSower);
            expect(this.groke.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
