describe('Operator Olluyyg', function () {
    describe("Operator Olluyyg's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['operator-olluyyg']
                },
                player2: {}
            });
        });

        it("increases opponent's key cost by 3 while exhausted", function () {
            this.player1.reap(this.operatorOlluyyg);
            expect(this.operatorOlluyyg.exhausted).toBe(true);
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
        });

        it("does not increase opponent's key cost while ready", function () {
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it('does not affect own key cost', function () {
            this.player1.reap(this.operatorOlluyyg);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
        });
    });
});
