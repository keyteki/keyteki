describe('Into the Fray', function () {
    describe("Into the Fray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['into-the-fray'],
                    inPlay: ['troll', 'tunk']
                },
                player2: {
                    inPlay: ['batdrone', 'lamindra', 'dextre']
                }
            });
        });

        it('should give a Brobnar creature a Fight: Ready ability for the turn', function () {
            this.player1.play(this.intoTheFray);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.troll);

            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.troll.exhausted).toBe(false);
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.troll.exhausted).toBe(false);
            this.player1.fightWith(this.troll, this.batdrone);
            expect(this.troll.exhausted).toBe(false);
            this.player1.fightWith(this.troll, this.dextre);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
