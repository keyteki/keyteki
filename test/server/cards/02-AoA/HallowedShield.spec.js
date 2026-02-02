describe('Hallowed Shield', function () {
    describe("Hallowed Shield's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['hallowed-shield', 'baron-mengevin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should prevent a creature from being dealt damage for the turn', function () {
            this.player1.useAction(this.hallowedShield);
            expect(this.player1).toBeAbleToSelect(this.baronMengevin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.baronMengevin);
            this.player1.fightWith(this.baronMengevin, this.troll);
            expect(this.baronMengevin.damage).toBe(0);
            expect(this.troll.damage).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
