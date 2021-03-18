describe('Flamegill Enforcer', function () {
    describe("Flamegill Enforcer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'unfathomable',
                    inPlay: ['flamegill-enforcer']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should capture 3A when action is used', function () {
            this.player1.useAction(this.flamegillEnforcer);
            expect(this.flamegillEnforcer.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should be enraged', function () {
                expect(this.flamegillEnforcer.enraged).toBe(true);
            });
        });

        describe('when controller raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should not be enraged', function () {
                expect(this.flamegillEnforcer.enraged).toBe(false);
            });
        });
    });
});
