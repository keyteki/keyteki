describe('Echofly', function () {
    describe("Echofly's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['echofly'],
                    discard: ['flaxia', 'a-strong-feeling', 'full-moon']
                },
                player2: {
                    amber: 1,
                    discard: ['stealth-mode']
                }
            });
        });

        it('returns an action card from discard to hand on action', function () {
            this.player1.playCreature(this.echofly);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.useAction(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.stealthMode);
            this.player1.clickCard(this.fullMoon);
            expect(this.fullMoon.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('returns topmost action card from discard to hand on scrap', function () {
            this.player1.scrap(this.echofly);
            expect(this.aStrongFeeling.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.fullMoon.location).toBe('discard');
            expect(this.echofly.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
