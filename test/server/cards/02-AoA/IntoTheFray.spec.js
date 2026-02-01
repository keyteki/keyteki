describe('Into the Fray', function () {
    describe("Into the Fray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['into-the-fray'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('should give a Brobnar creature a Fight: Ready ability for the turn', function () {
            this.player1.play(this.intoTheFray);

            expect(this.player1).toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.tunk);

            this.player1.fightWith(this.tunk, this.batdrone);
            expect(this.tunk.exhausted).toBe(false);

            this.player1.fightWith(this.tunk, this.dextre);
            expect(this.tunk.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
