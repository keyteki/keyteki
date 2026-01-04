describe('Talon of Invidius', function () {
    describe("Talon of Invidius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['talon-of-invidius', 'imp-losion'],
                    inPlay: ['shooler']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie', 'hunting-witch']
                }
            });
        });

        it('should exalt 3 times on play', function () {
            this.player1.playCreature(this.talonOfInvidius, false);
            expect(this.talonOfInvidius.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should move all amber to an enemy creature on destroyed', function () {
            this.player1.playCreature(this.talonOfInvidius, false);
            this.player1.play(this.impLosion);
            this.player1.clickCard(this.talonOfInvidius);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.talonOfInvidius);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
