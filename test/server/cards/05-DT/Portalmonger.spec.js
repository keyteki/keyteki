describe('Portalmonger', function () {
    describe("Portalmonger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['portalmonger']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        describe('while the tide is neutral', function () {
            it('should forge a key paying 6A', function () {
                this.player2.amber = 6;
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                expect(this.player2.amber).toBe(0);
            });
        });

        describe('while the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should forge a key paying 6A', function () {
                this.player2.amber = 6;
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                expect(this.player2.amber).toBe(0);
            });
        });

        describe('while the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should forge a key paying 10A', function () {
                this.player2.amber = 11;
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                expect(this.player2.amber).toBe(1);
            });
        });
    });
});
