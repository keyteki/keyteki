describe('Hoarding the Goods', function () {
    describe("Hoarding the Goods's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['hoarding-the-goods'],
                    inPlay: ['caspart', 'noxious-ionox', 'sparkscheme']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('captures 1 per friendly exhausted creature', function () {
            this.caspart.exhaust();
            this.noxiousIonox.exhaust();
            this.player1.play(this.hoardingTheGoods);
            expect(this.caspart.tokens.amber).toBe(1);
            expect(this.noxiousIonox.tokens.amber).toBe(1);
            expect(this.sparkscheme.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when no creatures exhausted', function () {
            this.player1.play(this.hoardingTheGoods);
            expect(this.caspart.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
