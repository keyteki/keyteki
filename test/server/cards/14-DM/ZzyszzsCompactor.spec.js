describe("Zzyszz's Compactor", function () {
    describe("Compactor's action", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zzyszz-s-compactor', 'iyxrenu-the-clever']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('can target an enemy creature for the deck and a friendly creature for counters', function () {
            const deckSize = this.player2.player.deck.length;
            this.player1.useAction(this.zzyszzSCompactor);
            // can target either friendly or enemy
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            this.player1.clickCard(this.troll);
            expect(this.player2.player.deck.length).toBe(deckSize + 1);
            expect(this.player2.player.deck[this.player2.player.deck.length - 1].id).toBe('troll');
            // power counter target: any creature
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.iyxrenuTheClever.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly creature for the deck and an enemy creature for counters', function () {
            const deckSize = this.player1.player.deck.length;
            this.player1.useAction(this.zzyszzSCompactor);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.player1.player.deck.length).toBe(deckSize + 1);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
