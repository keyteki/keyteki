describe('ForgedCurrency', function () {
    describe("Forged Currency's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['forged-currency'],
                    inPlay: ['exeldon-yash', 'krisper-ruld']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('forges no key when total moved is 0 and player has no extra amber', function () {
            this.player1.amber = 3;
            this.player1.play(this.forgedCurrency);
            expect(this.player1.amber).toBe(3);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges no key from enemy creatures', function () {
            this.player1.amber = 6;
            this.flaxia.amber = 3;
            this.flaxia.powerCounters = 3;
            this.player1.play(this.forgedCurrency);
            expect(this.player1.amber).toBe(6);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by total power counters and amber moved from different creatures', function () {
            this.player1.amber = 6;
            this.krisperRuld.amber = 3;
            this.exeldonYash.powerCounters = 3;
            this.player1.play(this.forgedCurrency);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by total power counters and amber moved at a minimum cost of 6', function () {
            this.player1.amber = 9;
            this.krisperRuld.amber = 6;
            this.exeldonYash.powerCounters = 6;
            this.player1.play(this.forgedCurrency);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by total power counters and amber moved from the same creature', function () {
            this.player1.amber = 6;
            this.exeldonYash.amber = 3;
            this.exeldonYash.powerCounters = 3;
            this.player1.play(this.forgedCurrency);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by amber moved', function () {
            this.player1.amber = 6;
            this.krisperRuld.amber = 6;
            this.player1.play(this.forgedCurrency);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by power counters moved', function () {
            this.player1.amber = 6;
            this.krisperRuld.powerCounters = 6;
            this.player1.play(this.forgedCurrency);
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges a key reduced by total power counters and amber moved from a damaged creature', function () {
            this.player1.amber = 6;
            this.exeldonYash.amber = 3;
            this.exeldonYash.powerCounters = 3;
            this.exeldonYash.damage = 3;
            this.player1.play(this.forgedCurrency);
            expect(this.player2.amber).toBe(0);
            expect(this.exeldonYash.location).toBe('discard');
            this.player1.clickPrompt('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.krisperRuld.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
