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
                    inPlay: ['troll']
                }
            });
        });

        it('deals damage = opp amber to enemy creature at end of turn if exhausted', function () {
            this.snapperDyn.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            // troll has 8 power, 3 dmg -> 3 damage tokens
            expect(this.troll.tokens.damage).toBe(3);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if not exhausted', function () {
            this.player1.endTurn();
            expect(this.troll.tokens.damage).toBeUndefined();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
