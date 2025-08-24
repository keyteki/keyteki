describe('Novice Gelard', function () {
    describe("Novice Gelard's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'barrister-joya'],
                    hand: ['novice-gelard']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should ready and reap with a neighboring Sanctum creature when played', function () {
            this.player1.reap(this.barristerJoya);
            this.player1.playCreature(this.noviceGelard);
            expect(this.player1).toBeAbleToSelect(this.barristerJoya);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.noviceGelard);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.barristerJoya);
            expect(this.barristerJoya.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow selecting non-Sanctum neighboring creatures', function () {
            this.player1.playCreature(this.noviceGelard, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
