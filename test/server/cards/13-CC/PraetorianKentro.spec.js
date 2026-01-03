describe('Praetorian Kentro', function () {
    describe("Praetorian Kentro's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['praetorian-kentro', 'charette', 'legatus-raptor'],
                    hand: ['philophosaurus']
                },
                player2: {
                    inPlay: ['tricerian-legionary']
                }
            });
        });

        it('should give +1 power to each friendly Saurian creature', function () {
            expect(this.charette.power).toBe(4);
            expect(this.legatusRaptor.power).toBe(5);
            expect(this.praetorianKentro.power).toBe(4);
            expect(this.tricerianLegionary.power).toBe(5);
        });

        it('should affect newly played Saurian creatures', function () {
            this.player1.playCreature(this.philophosaurus);
            expect(this.philophosaurus.power).toBe(5);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
