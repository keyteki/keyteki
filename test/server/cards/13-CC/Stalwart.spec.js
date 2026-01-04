describe('Stalwart', function () {
    describe("Stalwart's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['stalwart', 'charette', 'gub']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should be able to move anywhere in battleline after a fight', function () {
            this.player1.fightWith(this.stalwart, this.lamindra);
            this.player1.clickCard(this.stalwart);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.stalwart);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional', function () {
            this.player1.fightWith(this.stalwart, this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.stalwart);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
