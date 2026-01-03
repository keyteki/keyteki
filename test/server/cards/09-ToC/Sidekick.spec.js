describe('Sidekick', function () {
    describe("Sidekick's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['sidekick', 'a-strong-feeling', 'touchstone'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should make a token out of a card in hand', function () {
            this.player1.playCreature(this.sidekick);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.touchstone);
            this.player1.clickCard(this.touchstone);
            this.player1.clickPrompt('Left');
            expect(this.touchstone.name).toBe('Minion');
            expect(this.touchstone.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing if hand is empty', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.scrap(this.touchstone);
            this.player1.playCreature(this.sidekick);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
