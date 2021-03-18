describe('Bilgewarden', function () {
    describe("Bilgewarden's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['bilgewarden']
                },
                player2: {
                    hand: ['eyegor']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.play(this.bilgewarden);
            });

            it('raise the opponents tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.play(this.bilgewarden);
            });

            it('raise the opponents tide', function () {
                expect(this.player2.isTideHigh()).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.raiseTide();
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
                this.player1.play(this.bilgewarden);
            });

            it('raise the opponents tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
            });
        });
    });
});
