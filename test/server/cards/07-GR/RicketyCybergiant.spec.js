describe('Rickety Cybergiant', function () {
    describe("Rickety Cybergiant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['groke', 'rickety-cybergiant']
                },
                player2: {
                    inPlay: ['cpo-zytar', 'flaxia']
                }
            });
        });

        it('deals 1 damage to itself after a fight', function () {
            this.player1.fightWith(this.ricketyCybergiant, this.cpoZytar);
            expect(this.ricketyCybergiant.tokens.damage).toBe(5);
            expect(this.groke.tokens.damage).toBe(undefined);
            expect(this.flaxia.tokens.damage).toBe(undefined);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
