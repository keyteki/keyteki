describe('Spare Arm Carmine', function () {
    describe("Spare Arm Carmine's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['mutant-cutpurse'],
                    inPlay: ['spare-arm-carmine']
                },
                player2: {
                    amber: 3,
                    inPlay: ['fandangle']
                }
            });
        });

        it('should steal 1 if not more friendly mutants', function () {
            this.player1.reap(this.spareArmCarmine);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should steal 2 if more friendly mutants', function () {
            this.player1.playCreature(this.mutantCutpurse);
            this.player1.reap(this.spareArmCarmine);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
