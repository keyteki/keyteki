describe('Mighty Tiger', function () {
    describe("Mighty Tiger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['mighty-tiger'],
                    inPlay: ['flaxia']
                },
                player2: {
                    inPlay: ['troll', 'batdrone']
                }
            });
        });

        it('should deal 4 damage to an enemy creature on play', function () {
            this.player1.playCreature(this.mightyTiger);
            expect(this.player1).toHavePrompt('Mighty Tiger');
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
