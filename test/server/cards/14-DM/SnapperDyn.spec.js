describe('Snapper Dyn', function () {
    describe("Snapper Dyn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['snapper-dyn']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'umbra']
                }
            });
        });

        it('allocates 1 damage per opponent amber at end of turn if exhausted', function () {
            this.snapperDyn.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.umbra.location).toBe('discard');
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if not exhausted', function () {
            this.player1.endTurn();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.umbra.tokens.damage).toBeUndefined();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
