describe('Dr. Escotera', function () {
    describe("Dr. Escotera's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dr-escotera']
                },
                player2: {}
            });
        });

        it("should gain 1 amber for each opponent's forged key", function () {
            this.player2.player.keys = { blue: true, red: true, yellow: false };
            this.player1.play(this.drEscotera);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
