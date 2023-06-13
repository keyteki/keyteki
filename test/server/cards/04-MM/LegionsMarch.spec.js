describe('Legions March', function () {
    describe("Legions March's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['legion-s-march'],
                    inPlay: [
                        'brend-the-fanatic',
                        'mack-the-knife',
                        'consul-primus',
                        'praefectus-ludo'
                    ]
                },
                player2: {
                    house: 'untamed',
                    inPlay: ['mindwarper', 'blypyp', 'kangaphant'],
                    hand: ['nocturnal-maneuver']
                }
            });
        });

        it('should deal 1 damage to each non dinosaur creature when using a dinosaur creature', function () {
            this.player1.moveCard(this.kangaphant, 'discard');
            this.player1.play(this.legionSMarch);
            this.player1.reap(this.praefectusLudo);

            expect(this.praefectusLudo.tokens.damage).toBe(undefined);
            expect(this.consulPrimus.tokens.damage).toBe(undefined);
            expect(this.brendTheFanatic.tokens.damage).toBe(1);
            expect(this.mackTheKnife.tokens.damage).toBe(1);
            expect(this.mindwarper.tokens.damage).toBe(1);
        });

        it('if kangaphant is in play, and gets destroyed, creature which reaped should survive', function () {
            this.kangaphant.tokens.damage = 4;
            this.player1.play(this.legionSMarch);
            this.player1.reap(this.praefectusLudo);

            this.player1.clickPrompt(this.legionSMarch.name);

            expect(this.praefectusLudo.tokens.damage).toBe(undefined);
            expect(this.consulPrimus.tokens.damage).toBe(undefined);
            expect(this.praefectusLudo.location).toBe('play area');
            expect(this.kangaphant.location).toBe('discard');
            expect(this.brendTheFanatic.tokens.damage).toBe(1);
            expect(this.mackTheKnife.tokens.damage).toBe(1);
            expect(this.mindwarper.tokens.damage).toBe(1);
        });

        it('if kangaphant is in play, creature which reaped should be destroyed and still cause the 1D', function () {
            this.player1.play(this.legionSMarch);
            this.player1.reap(this.praefectusLudo);

            this.player1.clickCard(this.praefectusLudo);

            expect(this.praefectusLudo.tokens.damage).toBe(undefined);
            expect(this.consulPrimus.tokens.damage).toBe(undefined);
            expect(this.praefectusLudo.location).toBe('discard');
            expect(this.kangaphant.tokens.damage).toBe(1);
            expect(this.brendTheFanatic.tokens.damage).toBe(1);
            expect(this.mackTheKnife.tokens.damage).toBe(1);
            expect(this.mindwarper.tokens.damage).toBe(1);
        });
    });
});
