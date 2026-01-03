describe('Taniwha Evil Twin', function () {
    describe("Taniwha Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['taniwha-evil-twin', 'shooler', 'hookmaster'],
                    discard: ['sleep-with-the-fishes']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra'],
                    discard: ['gamgee']
                }
            });
        });

        it('should not prompt if no creatures in discard, after fight', function () {
            this.player1.fightWith(this.taniwhaEvilTwin, this.lamindra);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not prompt if no creatures in discard, after reap', function () {
            this.player1.fightWith(this.taniwhaEvilTwin, this.lamindra);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should place a creature from discard pile at the top of the deck, after fight', function () {
            this.player1.moveCard(this.shooler, 'discard');
            this.player1.moveCard(this.hookmaster, 'discard');
            this.player1.fightWith(this.taniwhaEvilTwin, this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.taniwhaEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gamgee);
            this.player1.clickCard(this.shooler);
            expect(this.player1.player.deck[0]).toBe(this.shooler);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should place a creature from discard pile at the top of the deck, after reap', function () {
            this.player1.moveCard(this.shooler, 'discard');
            this.player1.moveCard(this.hookmaster, 'discard');
            this.player1.reap(this.taniwhaEvilTwin, this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.taniwhaEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gamgee);
            this.player1.clickCard(this.shooler);
            expect(this.player1.player.deck[0]).toBe(this.shooler);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
