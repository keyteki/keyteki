describe('stirring-grave', function () {
    describe("Stirring Grave's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['stirring-grave'],
                    inPlay: ['buzzle'],
                    discard: ['dextre', 'way-of-the-bear', 'soul-snatcher', 'gateway-to-dis']
                },
                player2: {}
            });
        });

        it('should require you to archive a creature from your discard pile', function () {
            expect(this.dextre.location).toBe('discard');
            this.player1.play(this.stirringGrave);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.wayOfTheBear);
            expect(this.player1).not.toBeAbleToSelect(this.gatewayToDis);
            expect(this.player1).not.toBeAbleToSelect(this.soulSnatcher);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('archives');
        });
    });
});
