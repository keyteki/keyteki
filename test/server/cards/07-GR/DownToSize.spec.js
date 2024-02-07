describe('Down To Size', function () {
    describe("Down To Size's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['down-to-size'],
                    inPlay: ['cpo-zytar', 'flamethrower']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('makes an enemy creature have 1 power', function () {
            this.player1.play(this.downToSize);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.power).toBe(1);
            expect(this.cpoZytar.power).toBe(4);
            expect(this.cpoZytar.armor).toBe(1);
        });

        it('kills a creature with 1 damage', function () {
            this.player1.useAction(this.flamethrower);
            this.player1.clickCard(this.flaxia);
            this.player1.play(this.downToSize);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
        });
    });
});
