describe('Ammonia Clouds', function () {
    describe("Ammonia Clouds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ammonia-clouds'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['hunting-witch', 'mother']
                }
            });
        });

        it('should deal 3 damage to all creatures when played', function () {
            this.mother.tokens.ward = 1;
            this.player1.play(this.ammoniaClouds);
            expect(this.troll.damage).toBe(3);
            expect(this.mother.damage).toBe(0);
        });

        it('should destroy creatures with 3 or less power', function () {
            this.player1.play(this.ammoniaClouds);
            expect(this.troll.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
        });
    });
});
