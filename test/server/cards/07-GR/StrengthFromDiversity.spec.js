describe('Strength from Diversity', function () {
    describe("Strength from Diversity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['strength-from-diversity'],
                    inPlay: ['medic-ingram', 'batdrone', 'cpo-zytar', 'urchin']
                },
                player2: {
                    amber: 3,
                    inPlay: ['helmsman-spears']
                }
            });
        });

        it('captures one on each friendly non-SA creature', function () {
            this.player1.play(this.strengthFromDiversity);
            expect(this.medicIngram.amber).toBe(0);
            expect(this.batdrone.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(0);
            expect(this.urchin.amber).toBe(1);
            expect(this.helmsmanSpears.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows choosing where to capture', function () {
            this.player2.amber = 1;
            this.player1.play(this.strengthFromDiversity);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.helmsmanSpears);
            this.player1.clickCard(this.urchin);
            expect(this.medicIngram.amber).toBe(0);
            expect(this.batdrone.amber).toBe(0);
            expect(this.cpoZytar.amber).toBe(0);
            expect(this.urchin.amber).toBe(1);
            expect(this.helmsmanSpears.amber).toBe(0);
        });
    });
});
