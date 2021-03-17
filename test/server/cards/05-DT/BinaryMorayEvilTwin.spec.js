describe('Binary Moray Evil Twin', function () {
    describe("Binary Moray Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['binary-moray-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should be exhausted', function () {
                expect(this.binaryMorayEvilTwin.exhausted).toBe(true);
            });

            describe('when controller raises the tide', function () {
                beforeEach(function () {
                    this.player2.endTurn();
                    this.player1.clickPrompt('logos');
                    this.player1.raiseTide();
                });

                it('should not be readied', function () {
                    expect(this.binaryMorayEvilTwin.enraged).toBe(false);
                });
            });
        });
    });
});
