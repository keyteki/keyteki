describe('Lollop the Titanic', function () {
    describe("Lollop the Titanic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['lollop-the-titanic']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should deal no damage when attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.batdrone, this.lollopTheTitanic);
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.damage).toBe(0);
            expect(this.lollopTheTitanic.damage).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should deal damage when fighting', function () {
            this.player1.fightWith(this.lollopTheTitanic, this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.lollopTheTitanic.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
