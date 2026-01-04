describe('Pit Demon', function () {
    describe("Pit Demon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['pit-demon']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should steal 1 amber on action', function () {
            this.player1.clickCard(this.pitDemon);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal no amber if opponent has none', function () {
            this.player2.amber = 0;
            this.player1.clickCard(this.pitDemon);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
