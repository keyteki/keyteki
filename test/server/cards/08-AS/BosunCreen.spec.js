describe('Bosun Creen', function () {
    describe("Bosun Creen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['bosun-creen'],
                    inPlay: ['hunting-witch', 'gub', 'dust-pixie']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'pelf']
                }
            });
        });

        it('should move a friendly creature to a flank on scrap', function () {
            this.player1.scrap(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.gub);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should move an enemy creature to a flank on scrap', function () {
            this.player1.scrap(this.bosunCreen);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Left');
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.pelf);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
