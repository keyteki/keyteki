describe('Lord Golgotha', function () {
    describe("Lord Golgotha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['lord-golgotha']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('should deal 3 damage to neighbors of the creature it fights', function () {
            this.player1.fightWith(this.lordGolgotha, this.krump);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 3 damage to single neighbor when fighting a flank', function () {
            this.player1.fightWith(this.lordGolgotha, this.troll);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.bumpsy.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
