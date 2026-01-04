describe('Phosphorus Stars', function () {
    describe("Phosphorus Stars' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['phosphorus-stars'],
                    inPlay: ['zorg', 'tunk', 'troll', 'dodger']
                },
                player2: {
                    inPlay: ['mindwarper', 'batdrone', 'flaxia']
                }
            });
        });

        it('should stun all non-Mars creatures and gain 2 chains', function () {
            this.player1.play(this.phosphorusStars);
            expect(this.zorg.stunned).toBe(false);
            expect(this.tunk.stunned).toBe(false);
            expect(this.troll.stunned).toBe(true);
            expect(this.dodger.stunned).toBe(true);
            expect(this.mindwarper.stunned).toBe(false);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.player1.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
