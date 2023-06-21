describe('Toxicuda Venom', function () {
    describe("Toxicuda Venom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['toxicuda-venom'],
                    inPlay: ['bubbles']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should give poison to creature', function () {
            this.player1.playUpgrade(this.toxicudaVenom, this.bubbles);
            this.player1.fightWith(this.bubbles, this.krump);
            expect(this.krump.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
