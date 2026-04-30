describe('Paralysis Synan', function () {
    describe("Paralysis Synan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['paralysis-synan']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('stuns, enrages, and exhausts an enemy creature on reap', function () {
            this.player1.reap(this.paralysisSynan);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            expect(this.troll.enraged).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly creature', function () {
            this.player2.moveCard(this.troll, 'hand');
            this.player1.reap(this.paralysisSynan);
            this.player1.clickCard(this.paralysisSynan);
            expect(this.paralysisSynan.stunned).toBe(true);
            expect(this.paralysisSynan.enraged).toBe(true);
            expect(this.paralysisSynan.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
