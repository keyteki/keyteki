describe('VastStoik', function () {
    describe("Vast Stoik's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['vast-stoik'],
                    deck: ['troll', 'mack-the-knife']
                },
                player2: {
                    inPlay: ['urchin', 'krump']
                }
            });
            this.urchin.amber = 2;
        });

        it('moves 1 amber from a creature to common supply and draws a card', function () {
            this.urchin.amber = 2;
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.vastStoik, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.vastStoik);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.vastStoik.amber).toBe(0);
            expect(this.urchin.amber).toBe(1);
            expect(this.krump.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('any creature is selectable, including those without amber', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.vastStoik, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.vastStoik);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.vastStoik.amber).toBe(0);
            expect(this.urchin.amber).toBe(2);
            expect(this.krump.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
