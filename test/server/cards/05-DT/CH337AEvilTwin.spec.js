describe('CH-337A Evil Twin', function () {
    describe("CH-337A Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: [],
                    inPlay: ['flaxia', 'ch-337a-evil-twin', 'dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should give skirmish when tide is high', function () {
            expect(this.ch337aEvilTwin.neighbors[0]).toBe(this.flaxia);
            expect(this.ch337aEvilTwin.neighbors[1]).toBe(this.dustPixie);

            expect(this.flaxia.getKeywordValue('skirmish')).toBe(0);
            expect(this.dustPixie.getKeywordValue('skirmish')).toBe(0);

            this.player1.raiseTide();

            expect(this.flaxia.getKeywordValue('skirmish')).toBe(1);
            expect(this.dustPixie.getKeywordValue('skirmish')).toBe(1);
        });

        it('should not break when alone', function () {
            this.player1.moveCard(this.flaxia, 'hand');
            this.player1.moveCard(this.dustPixie, 'hand');

            this.player1.raiseTide();

            this.player1.endTurn();
        });
    });
});
