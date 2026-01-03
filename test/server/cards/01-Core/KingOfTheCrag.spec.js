describe('King of the Crag', function () {
    describe("King of the Crag's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['king-of-the-crag'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['krump', 'batdrone', 'pingle-who-annoys']
                }
            });
        });

        it('should reduce power of enemy Brobnar creatures by 2', function () {
            this.player1.play(this.kingOfTheCrag);
            expect(this.troll.power).toBe(8); // Friendly, no reduction
            expect(this.batdrone.power).toBe(2); // Not Brobnar, no reduction
            expect(this.krump.power).toBe(4); // 6 - 2
            expect(this.pingleWhoAnnoys.location).toBe('discard'); // Power 0, destroyed
            expect(this.kingOfTheCrag.tokens.damage).toBe(undefined); // No damage taken from Pingle
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
