describe('Eunoia', function () {
    describe("Eunoia' fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['questor-jarta', 'eunoia'],
                    amber: 2
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should heal itself and gain 1 aember after fighting', function () {
            this.player1.fightWith(this.eunoia, this.grovekeeper);
            expect(this.player1.amber).toBe(3);
            expect(this.eunoia.tokens.damage).toBe(1);
        });

        it('should should heal itself and gain 1 aember after being fought', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.grovekeeper, this.eunoia);
            expect(this.player1.amber).toBe(3);
            expect(this.eunoia.tokens.damage).toBe(1);
        });
    });
});
