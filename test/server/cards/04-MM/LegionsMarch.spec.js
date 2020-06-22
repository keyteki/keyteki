describe('Legions March', function () {
    describe("Legions March's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['legion-s-march'],
                    inPlay: ['brend-the-fanatic', 'mack-the-knife', 'consul-primus']
                },
                player2: {
                    house: 'untamed',
                    inPlay: ['mindwarper', 'blypyp'],
                    hand: ['nocturnal-maneuver']
                }
            });
        });

        it('should deal 1 damage to each non dinosaur creature when using a dinosaur creature', function () {
            this.player1.play(this.legionSMarch);
            this.player1.reap(this.consulPrimus);

            this.player1.clickCard(this.consulPrimus);

            expect(this.consulPrimus.tokens.damage).toBe(undefined);
            expect(this.brendTheFanatic.tokens.damage).toBe(1);
            expect(this.mackTheKnife.tokens.damage).toBe(1);
            expect(this.mindwarper.tokens.damage).toBe(1);
        });
    });
});
