describe('ForgedCurrency', function () {
    describe("Forged Currency's ability", function () {
        it('forges no key when total moved is 0 and player has no extra amber', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['forged-currency'],
                    inPlay: ['exeldon-yash']
                }
            });
            this.player1.play(this.forgedCurrency);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by total power counters and amber moved', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 6,
                    hand: ['forged-currency'],
                    inPlay: ['exeldon-yash', 'krisper-ruld']
                }
            });
            this.exeldonYash.powerCounters = 3;
            this.krisperRuld.amber = 3;
            this.player1.play(this.forgedCurrency);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
