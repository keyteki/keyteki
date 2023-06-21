describe('Antiquities Dealer', function () {
    describe("Antiquities Dealer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer'],
                    hand: ['æmbitrage']
                },
                player2: {
                    inPlay: ['gauntlet-of-command']
                }
            });
        });

        it('should not gain amber with fewer than 2 friendly artifacts', function () {
            this.player1.useAction(this.antiquitiesDealer);
            expect(this.player1.amber).toBe(6);
        });

        it('should gain 2 amber with at least than 2 artifacts', function () {
            this.player1.play(this.æmbitrage);
            this.player1.useAction(this.antiquitiesDealer);
            expect(this.player1.amber).toBe(8);
        });
    });
});
