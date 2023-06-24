describe('Berserker', function () {
    describe("Berserker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'berserker',
                    amber: 2,
                    inPlay: ['armsmaster-molina'],
                    hand: ['red-alert', 'krump', 'brammo', 'ragnarok-prep']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'lamindra']
                }
            });
            this.player1.moveCard(this.redAlert, 'deck');
            this.player1.play(this.ragnarokPrep);
            this.player1.clickPrompt('Left');

            this.berserker = this.redAlert;
        });

        it('should enter play ready', function () {
            expect(this.berserker.exhausted).toBe(false);
            expect(this.berserker.enraged).toBe(true);
        });

        it('should be destroyed after fight', function () {
            this.player1.fightWith(this.berserker, this.lamindra);
            expect(this.berserker.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
        });
    });
});
