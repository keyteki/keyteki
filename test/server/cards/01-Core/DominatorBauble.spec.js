describe('Dominator Bauble', function () {
    describe("Dominator Bauble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dominator-bauble', 'dodger', 'shaffles']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('should be able to use a friendly out of house creature', function () {
            this.player1.useAction(this.dominatorBauble);
            this.player1.clickCard(this.dodger);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.urchin);
            expect(this.dodger.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to use a friendly in house creature', function () {
            this.player1.useAction(this.dominatorBauble);
            this.player1.clickCard(this.shaffles);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.shaffles.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
