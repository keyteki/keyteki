describe('ConradFisique', function () {
    describe("Conrad Fisique's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['conrad-fisique'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.exeldonYash.powerCounters = 2;
        });

        it('moves all +1 power counters from one creature to another', function () {
            this.player1.play(this.conradFisique);
            this.player1.clickCard(this.conradFisique);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickCard(this.troll);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.troll.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips effect if player declines', function () {
            this.player1.play(this.conradFisique);
            this.player1.clickPrompt('Done');
            expect(this.exeldonYash.powerCounters).toBe(2);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
