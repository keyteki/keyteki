describe('Agorim', function () {
    describe("Agorim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['caspart', 'agorim', 'noxious-ionox']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('grants +5 power to friendly creatures while in center', function () {
            expect(this.agorim.isInCenter()).toBe(true);
            expect(this.caspart.power).toBe(this.caspart.powerPrinted + 5);
            expect(this.agorim.power).toBe(this.agorim.powerPrinted + 5);
            expect(this.noxiousIonox.power).toBe(this.noxiousIonox.powerPrinted + 5);
            expect(this.troll.power).toBe(this.troll.powerPrinted);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant power when not in center', function () {
            this.player1.moveCard(this.caspart, 'discard');
            expect(this.agorim.isInCenter()).toBe(false);
            expect(this.noxiousIonox.power).toBe(this.noxiousIonox.powerPrinted);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
