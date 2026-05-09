describe('CAENDLE Unit', function () {
    describe("CAENDLE Unit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dust-imp', 'stealer-of-souls', 'dominator-bauble']
                },
                player2: {
                    inPlay: ['cændle-unit']
                }
            });
        });

        it('should cause the player to draw a card when their opponent reaps', function () {
            this.player1.reap(this.dustImp);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.hand.length).toBe(1);
            this.player1.reap(this.stealerOfSouls);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.hand.length).toBe(2);
        });
        it('should capture an amber with the action ability', function () {
            this.player1.reap(this.dustImp);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.hand.length).toBe(1);
            this.player1.reap(this.stealerOfSouls);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.hand.length).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.cændleUnit);
            this.player2.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(1);
        });
    });
});
