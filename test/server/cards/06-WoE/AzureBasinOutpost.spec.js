describe('Azure Basin Outpost', function () {
    describe("Azure Basin Outpost's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['azure-basin-outpost', 'kaupe', 'hookmaster'],
                    hand: ['abyssal-sight', 'murkens', 'troll']
                },
                player2: {
                    inPlay: ['almsmaster', 'shooler', 'dust-imp', 'gatekeeper'],
                    hand: ['bulwark']
                }
            });
        });

        it('should exhaust exactly 3 creatures', function () {
            this.player1.useAction(this.azureBasinOutpost);
            this.player1.clickCard(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.gatekeeper);
            expect(this.player1).not.toBeAbleToSelect(this.hookmaster);
            this.player1.clickCard(this.shooler);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.dustImp);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.gatekeeper);
            this.player1.clickPrompt('Done');
            expect(this.shooler.exhausted).toBe(true);
            expect(this.dustImp.exhausted).toBe(true);
            expect(this.gatekeeper.exhausted).toBe(true);
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.kaupe);
        });

        it('should fizzle with no creatures in play', function () {
            this.player1.fightWith(this.kaupe, this.gatekeeper);
            this.player1.fightWith(this.hookmaster, this.gatekeeper);
            this.player1.useAction(this.azureBasinOutpost);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
