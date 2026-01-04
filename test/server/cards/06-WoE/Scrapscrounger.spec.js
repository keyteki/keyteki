describe('Scrapscrounger', function () {
    describe("Scrapscrounger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['scrapscrounger'],
                    hand: ['exchange-program', 'bumpsy'],
                    discard: ['pelf', 'lifeward']
                }
            });
        });

        it('allows player to swap a artifact from discard creature with card from hand', function () {
            this.player1.reap(this.scrapscrounger);
            expect(this.player1).toBeAbleToSelect(this.lifeward);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.lifeward);
            expect(this.player1).toBeAbleToSelect(this.exchangeProgram);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.lifeward.location).toBe('hand');
            expect(this.player1.hand.indexOf(this.lifeward)).toBe(1);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1.discard.indexOf(this.bumpsy)).toBe(1);
        });

        it('fizzles with no discarded artifact', function () {
            this.lifeward.location = 'deck';
            this.player1.reap(this.scrapscrounger);
            expect(this.player1).isReadyToTakeAction();
        });

        it('fizzles with empty hand', function () {
            this.player1.hand = [];
            this.player1.reap(this.scrapscrounger);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
