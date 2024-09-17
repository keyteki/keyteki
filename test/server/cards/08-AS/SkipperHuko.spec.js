describe('Skipper Huko', function () {
    describe("Skipper Huko's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['skipper-hukŏ', 'dust-pixie']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'pelf', 'flaxia']
                }
            });
        });

        it('should capture on reap and exalt enemy flank creatures', function () {
            this.player1.reap(this.skipperHukŏ);
            expect(this.skipperHukŏ.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
            expect(this.pelf.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not exalt enemy flank creatures if nothing is captured', function () {
            this.player2.amber = 0;
            this.player1.reap(this.skipperHukŏ);
            expect(this.skipperHukŏ.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.flaxia.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
