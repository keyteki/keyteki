describe('Sentient Cloud', function () {
    describe("Sentient Cloud's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['sentient-cloud', 'blypyp', 'memrox-the-red', 'myx-the-tallminded']
                },
                player2: {
                    amber: 3,
                    hand: ['de-animator'],
                    inPlay: ['culf-the-quiet', 'lamindra']
                }
            });

            this.sentientCloud.printedHouse = 'mars';
            this.sentientCloud.maverick = 'mars';
        });

        it('should give highest-powered friendly creatures a fight ability to gain 2', function () {
            this.player1.fightWith(this.memroxTheRed, this.lamindra);
            expect(this.player1.amber).toBe(3);
            this.player1.fightWith(this.myxTheTallminded, this.lamindra);
            expect(this.player1.amber).toBe(5);
            this.player1.fightWith(this.blypyp, this.culfTheQuiet);
            expect(this.player1.amber).toBe(5);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.culfTheQuiet, this.blypyp);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not break when there are no friendly creature', function () {
            this.player1.moveCard(this.blypyp, 'discard');
            this.player1.moveCard(this.memroxTheRed, 'discard');
            this.player1.moveCard(this.myxTheTallminded, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature(this.deAnimator);
            this.player2.clickCard(this.sentientCloud);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
