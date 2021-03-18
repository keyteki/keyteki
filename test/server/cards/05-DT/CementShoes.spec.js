describe('Cement Shoes', function () {
    describe("Cement Shoes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['cement-shoes'],
                    inPlay: ['archimedes']
                },
                player2: {
                    inPlay: ['troll', 'redlock', 'bad-penny']
                }
            });

            this.player1.play(this.cementShoes);
            expect(this.player1.isTideHigh()).toBe(false);
        });

        it('should be able to target all creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
        });

        describe('and deal 2D destroying a creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.badPenny);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
                expect(this.player1.chains).toBe(0);
            });
        });

        describe('and deal 2D not destroying a creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('should not raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(false);
                expect(this.player1.chains).toBe(0);
            });
        });
    });
});
