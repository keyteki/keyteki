describe('Journey Onward', function () {
    describe("Journey Onward's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['journey-onward'],
                    inPlay: ['aero-o-fore', 'bux-bastian', 'charette'],
                    amber: 1
                },
                player2: {
                    inPlay: ['lamindra', 'tantadlin'],
                    amber: 3
                }
            });
        });

        it('should target a friendly Skyborn creature and give it After Fight ability', function () {
            this.aeroOFore.exhaust();
            this.player1.play(this.journeyOnward);
            expect(this.player1).toBeAbleToSelect(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.buxBastian);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not give the ability to other creatures', function () {
            this.player1.play(this.journeyOnward);
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickCard(this.lamindra);

            // Fight with a different creature - should not steal amber
            this.player1.fightWith(this.buxBastian, this.tantadlin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose the ability after the turn ends', function () {
            this.player1.play(this.journeyOnward);
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickCard(this.lamindra);

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');

            // The ability should be gone now
            this.player1.fightWith(this.aeroOFore, this.tantadlin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
