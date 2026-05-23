describe('Observ-U-Max', function () {
    describe("Observ-U-Max's granted abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armory-officer-nel'],
                    hand: ['observ-u-max']
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin']
                }
            });
            this.player1.playUpgrade(this.observUMax, this.armoryOfficerNel);
        });

        it('captures 1A on reap', function () {
            this.player1.reap(this.armoryOfficerNel);
            expect(this.armoryOfficerNel.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 1A on fight', function () {
            this.player1.fightWith(this.armoryOfficerNel, this.urchin);
            expect(this.armoryOfficerNel.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
