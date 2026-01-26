describe('Bury Riches', function () {
    describe("Bury Riches' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['senator-shrix', 'saurian-egg', 'ardent-hero'],
                    hand: ['bury-riches']
                },
                player2: {
                    amber: 1,
                    inPlay: ['murkens', 'lamindra', 'urchin']
                }
            });

            this.senatorShrix.amber = 3;
            this.saurianEgg.amber = 1;
            this.murkens.amber = 1;
            this.lamindra.amber = 2;
        });

        it('should raise the tide if it is neutral', function () {
            expect(this.player1.isTideNeutral()).toBe(true);
            this.player1.play(this.buryRiches);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(3);
            expect(this.saurianEgg.amber).toBe(1);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.murkens.amber).toBe(1);
            expect(this.lamindra.amber).toBe(2);
            expect(this.urchin.amber).toBe(0);
            expect(this.player1.isTideHigh()).toBe(true);
        });

        it('should raise the tide if it is low', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideLow()).toBe(true);
            this.player1.play(this.buryRiches);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(3);
            expect(this.saurianEgg.amber).toBe(1);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.murkens.amber).toBe(1);
            expect(this.lamindra.amber).toBe(2);
            expect(this.urchin.amber).toBe(0);
            expect(this.player1.isTideHigh()).toBe(true);
        });

        it("should move amber from each creature to their controller's pool", function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.play(this.buryRiches);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.senatorShrix.amber).toBe(2);
            expect(this.saurianEgg.amber).toBe(0);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.murkens.amber).toBe(0);
            expect(this.lamindra.amber).toBe(1);
            expect(this.urchin.amber).toBe(0);
        });
    });
});
