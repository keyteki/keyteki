describe('Carpet Phloxem', function () {
    describe("Carpet Phloxem's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['carpet-phloxem', 'mindwarper']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone']
                }
            });
        });

        it('should deal 4 damage to each creature if no friendly creatures in play', function () {
            this.player1.play(this.carpetPhloxem);
            expect(this.zorg.damage).toBe(4);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not deal damage if there are friendly creatures in play', function () {
            this.player1.playCreature(this.mindwarper);
            this.player1.play(this.carpetPhloxem);
            expect(this.zorg.damage).toBe(0);
            expect(this.batdrone.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
