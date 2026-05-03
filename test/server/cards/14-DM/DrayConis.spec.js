describe('Dray Conis', function () {
    describe("Dray Conis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['dray-conis', 'caspart']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('destroys each creature at start of turn if exhausted', function () {
            this.drayConis.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            expect(this.drayConis.location).toBe('discard');
            expect(this.caspart.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if not exhausted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            expect(this.drayConis.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
