describe('Ballistego', function () {
    describe("Ballistego's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['ballistego'],
                    inPlay: ['ether-spider']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should have splash attack with amber', function () {
            this.player1.play(this.ballistego);
            expect(this.player1).toBeAbleToSelect(this.ballistego);
            expect(this.player1).not.toBeAbleToSelect(this.etherSpider);
            this.player1.clickCard(this.ballistego);
            expect(this.ballistego.tokens.amber).toBe(1);
            expect(this.ballistego.getKeywordValue('splash-attack')).toBe(3);
        });

        it('should not have splash attack without amber', function () {
            this.player1.play(this.ballistego);
            this.player1.clickPrompt('Done');
            expect(this.ballistego.tokens.amber).toBe(undefined);
            expect(this.ballistego.getKeywordValue('splash-attack')).toBe(0);
        });
    });
});
