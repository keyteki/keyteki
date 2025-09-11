describe('The Second Mouse', function () {
    describe("The Second Mouse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    prophecies: [
                        'the-second-mouse',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('should fulfill when opponent has less amber at end of their turn', function () {
            this.player1.activateProphecy(this.theSecondMouse, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(0);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player1.clickPrompt('dis');
        });

        it('should not fulfill when opponent has more amber at end of their turn', function () {
            this.player1.activateProphecy(this.theSecondMouse, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.amber = 4;
            this.player2.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
            this.player1.clickPrompt('dis');
        });
    });
});
