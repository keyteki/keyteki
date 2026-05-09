describe('Flamewake Shaman', function () {
    describe("Flamewake Shaman's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['flamewake-shaman']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone']
                }
            });
        });

        it('should deal 2 damage to a creature on play', function () {
            this.player1.play(this.flamewakeShaman);
            expect(this.player1).toBeAbleToSelect(this.flamewakeShaman);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
