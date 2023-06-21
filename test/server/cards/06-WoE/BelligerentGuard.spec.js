describe('Belligerent Guard', function () {
    describe("Belligerent Guard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['belligerent-guard']
                },
                player2: {
                    discard: ['ancient-bear']
                }
            });
        });

        it('should enter play ready and opponent draws a card', function () {
            this.player1.player.moveCard(this.ancientBear, 'deck');
            let deckSize = this.player2.deck.length;
            this.player1.play(this.belligerentGuard);
            expect(this.belligerentGuard.location).toBe('play area');
            expect(this.belligerentGuard.exhausted).toBe(false);
            expect(this.player2.hand.length).toBe(1);
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player2.deck.length).toBe(deckSize - 1);
        });

        it('should be able to use it', function () {
            this.player1.play(this.belligerentGuard);
            this.player1.reap(this.belligerentGuard);
            expect(this.player1.amber).toBe(1);
        });
    });
});
