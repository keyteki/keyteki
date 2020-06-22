describe('Thero Centurion', function () {
    describe("Thero Centurion' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta'],
                    hand: ['thero-centurion']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should capture 1 amber after play', function () {
            this.player1.playCreature(this.theroCenturion);
            expect(this.player2.amber).toBe(2);
            expect(this.theroCenturion.tokens.amber).toBe(1);
        });
    });

    describe("Thero Centurion' fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta', 'thero-centurion']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should not move amber to opponent', function () {
            this.player1.fightWith(this.theroCenturion, this.grovekeeper);
            expect(this.player2.amber).toBe(2);
            expect(this.theroCenturion.tokens.amber).toBe(1);
        });
    });
});
