describe('Qyxxlyx Plague Master', function () {
    describe("Qyxxlyx Plague Master's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['qyxxlyx-plague-master', 'sergeant-zakiel']
                },
                player2: {
                    inPlay: ['protectrix', 'sequis', 'urchin']
                }
            });
        });

        it('should deal 3 damage to each Human creature after fight, ignoring armor', function () {
            this.player1.fightWith(this.qyxxlyxPlagueMaster, this.urchin);
            expect(this.sergeantZakiel.tokens.damage).toBe(3);
            expect(this.protectrix.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(3);
            expect(this.urchin.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 3 damage to each Human creature after reap, ignoring armor', function () {
            this.player1.reap(this.qyxxlyxPlagueMaster);
            expect(this.sergeantZakiel.tokens.damage).toBe(3);
            expect(this.protectrix.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(3);
            expect(this.urchin.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
