describe('Flamegill Enforcer Evil Twin', function () {
    describe("Flamegill Enforcer Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'unfathomable',
                    inPlay: ['flamegill-enforcer-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('should steal 1A when action is used', function () {
            this.player1.useAction(this.flamegillEnforcerEvilTwin);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should be enraged', function () {
                expect(this.flamegillEnforcerEvilTwin.enraged).toBe(true);
            });
        });

        describe('when controller raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should not be enraged', function () {
                expect(this.flamegillEnforcerEvilTwin.enraged).toBe(false);
            });
        });
    });
});
