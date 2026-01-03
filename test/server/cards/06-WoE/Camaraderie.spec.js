describe('Camaraderie', function () {
    describe("Camaraderie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: [
                        'sensor-chief-garcia',
                        'batdrone',
                        'cr-officer-hawkins',
                        'urchin',
                        'helmsman-spears',
                        'explo-rover'
                    ],
                    hand: ['camaraderie']
                }
            });
        });

        it('should draw 4 when there are 2 non-SA neighbors', function () {
            this.player1.play(this.camaraderie);
            this.player1.clickCard(this.crOfficerHawkins);
            expect(this.crOfficerHawkins.exhausted).toBe(true);
            expect(this.player1.hand.length).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw 2 when there is 1 non-SA neighbor', function () {
            this.player1.play(this.camaraderie);
            this.player1.clickCard(this.sensorChiefGarcia);
            expect(this.sensorChiefGarcia.exhausted).toBe(true);
            expect(this.player1.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw 0 when there are 0 non-SA neighbors', function () {
            this.player1.play(this.camaraderie);
            this.player1.clickCard(this.exploRover);
            expect(this.exploRover.exhausted).toBe(true);
            expect(this.player1.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw 0 when the creature is already exhausted', function () {
            this.player1.reap(this.crOfficerHawkins);
            this.player1.play(this.camaraderie);
            this.player1.clickCard(this.crOfficerHawkins);
            expect(this.player1.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
