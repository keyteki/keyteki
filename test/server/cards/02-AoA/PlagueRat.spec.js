describe('Plague Rat', function () {
    describe("Plague Rat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['mighty-tiger', 'dextre'],
                    hand: ['plague-rat', 'plague-rat']
                },
                player2: {
                    inPlay: ['horseman-of-famine', 'horseman-of-death']
                }
            });
        });

        it('should deal 1 damage to all non-rat creatures', function () {
            this.player1.play(this.plagueRat);
            expect(this.mightyTiger.tokens.damage).toBe(1);
            expect(this.dextre.tokens.damage).toBe(1);
            expect(this.plagueRat.hasToken('damage')).toBe(false);
            expect(this.horsemanOfFamine.tokens.damage).toBe(1);
            expect(this.horsemanOfDeath.tokens.damage).toBe(1);
        });

        it('second Plague Rat should deal 2 damage to all non-rat-creatures', function () {
            this.player1.play(this.plagueRat);
            this.plagueRat2 = this.player1.findCardByName('plague-rat', 'hand');

            this.player1.play(this.plagueRat2);

            expect(this.mightyTiger.tokens.damage).toBe(3);
            expect(this.player1.player.deck[0]).toBe(this.dextre); // Dextre's behaviour when destroyed.
            expect(this.plagueRat.hasToken('damage')).toBe(false);
            expect(this.horsemanOfFamine.tokens.damage).toBe(3);
            expect(this.horsemanOfDeath.tokens.damage).toBe(3);
        });
    });
});
