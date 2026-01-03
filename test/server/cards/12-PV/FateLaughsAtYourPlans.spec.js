describe('Fate Laughs at Your Plans', function () {
    describe("Fate Laughs at Your Plans's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'fate-laughs-at-your-plans',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'overreach'
                    ],
                    hand: ['parasitic-arachnoid'],
                    archives: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    hand: ['flaxia', 'searine'],
                    inPlay: ['yurk'],
                    archives: ['poke', 'batdrone']
                }
            });
        });

        it('should fulfill when opponent adds archives to hand', function () {
            this.player1.activateProphecy(this.fateLaughsAtYourPlans, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('Yes');
            this.player2.clickCard(this.yurk);
            expect(this.player2.amber).toBe(2);
            expect(this.yurk.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when player adds archives to hand', function () {
            this.player1.activateProphecy(this.fateLaughsAtYourPlans, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.clickPrompt('Yes');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
