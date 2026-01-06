describe("Zealot's Revelation", function () {
    describe("Zealot's Revelation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['zealot-s-revelation']
                },
                player2: {}
            });
        });

        it('draws 4 cards on play', function () {
            this.player1.play(this.zealotSRevelation);
            expect(this.player1.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
