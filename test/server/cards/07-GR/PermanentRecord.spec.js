describe('Permanent Record', function () {
    describe("Permanent Record's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['permanent-record'],
                    inPlay: ['gemcoat-vendor', 'batdrone']
                },
                player2: {
                    amber: 3,
                    inPlay: ['cpo-zytar']
                }
            });
        });

        it('can exhaust a friendly creature to steal 2', function () {
            this.player1.play(this.permanentRecord);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.gemcoatVendor.exhausted).toBe(false);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if you choose an exhausted creature', function () {
            this.player1.reap(this.gemcoatVendor);
            this.player1.play(this.permanentRecord);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.gemcoatVendor.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing with no friendly creatures', function () {
            this.player1.moveCard(this.gemcoatVendor, 'discard');
            this.player1.moveCard(this.batdrone, 'discard');
            this.player1.play(this.permanentRecord);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
