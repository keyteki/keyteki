describe('Gauntlet of Command', function () {
    describe("Gauntlet of Command's ability with enemy creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['gauntlet-of-command', 'dextre']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
            this.dextre.exhausted = true;
        });

        it('should ready and fight with a friendly creature', function () {
            this.player1.useAction(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Gauntlet of Command's ability with no enemy creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['gauntlet-of-command', 'dextre']
                },
                player2: {}
            });
            this.dextre.exhausted = true;
        });

        it('should ready a friendly creature', function () {
            this.player1.useAction(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            this.expectReadyToTakeAction(this.player1);
            expect(this.dextre.exhausted).toBe(false);
        });
    });
});
