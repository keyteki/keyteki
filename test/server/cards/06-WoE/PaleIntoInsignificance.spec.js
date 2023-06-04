describe('Pale Into Insignificance', function () {
    describe("Pale Into Insignificance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['bubbles', 'pale-into-insignificance'],
                    inPlay: ['flaxia', 'dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['urchin', 'krump']
                }
            });
        });

        it('kills creatures from both sides', function () {
            this.player1.play(this.paleIntoInsignificance);

            expect(this.urchin.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
        });
    });
});
