describe('Ekwirres Fulcrum', function () {
    describe("Ekwirres Fulcrum's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['ekwirrĕ-s-fulcrum', 'cpo-zytar']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('can choose to do nothing', function () {
            let p2hand = this.player2.player.hand.length;
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player2.player.hand.length).toBe(p2hand);
        });

        it('can choose to gain amber and opponent draw cards', function () {
            let p2hand = this.player2.player.hand.length;
            this.player1.endTurn();
            this.player1.clickCard(this.ekwirrĕSFulcrum);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player2.player.hand.length).toBe(p2hand + 2);
        });

        it('can be used by opponent too', function () {
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('untamed');
            let p1hand = this.player1.player.hand.length;
            this.player2.endTurn();
            this.player2.clickCard(this.ekwirrĕSFulcrum);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(p1hand + 2);
        });
    });
});
