describe('Prototype Harness', function () {
    describe("Prototype Harness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'staralliance',
                    hand: ['prototype-harness']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
            this.player1.playUpgrade(this.prototypeHarness, this.urchin);
        });

        it('should modify power', function () {
            expect(this.urchin.power).toBe(7);
        });

        it('should deal 1 damage at start of turn', function () {
            this.player1.endTurn();
            expect(this.urchin.tokens.damage).toBe(1);
        });
    });
});
