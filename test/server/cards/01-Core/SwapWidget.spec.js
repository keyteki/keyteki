describe('Swap Widget', function () {
    describe("Swap Widget's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['mindwarper', 'zorg', 'swap-widget'],
                    hand: ['john-smyth', 'battle-fleet']
                }
            });
        });

        it('should return ready Mars creature and put different Mars creature into play readied', function () {
            this.zorg.exhausted = true;
            this.player1.useAction(this.swapWidget);
            expect(this.player1).toHavePrompt('Swap Widget');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.mindwarper);
            expect(this.mindwarper.location).toBe('hand');
            expect(this.zorg.location).toBe('play area');
            expect(this.player1).toHavePrompt('Swap Widget');
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.battleFleet);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.johnSmyth);
            this.player1.clickPrompt('Right');
            expect(this.johnSmyth.location).toBe('play area');
            expect(this.johnSmyth.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not target exhausted Mars creatures', function () {
            this.zorg.exhausted = true;
            this.mindwarper.exhausted = true;
            this.player1.useAction(this.swapWidget);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
