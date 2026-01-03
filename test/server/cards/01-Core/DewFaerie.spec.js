describe('Dew Faerie', function () {
    describe("Dew Faerie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dew-faerie']
                },
                player2: {}
            });
        });

        it('should gain 1 amber when reaped', function () {
            this.player1.reap(this.dewFaerie);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
