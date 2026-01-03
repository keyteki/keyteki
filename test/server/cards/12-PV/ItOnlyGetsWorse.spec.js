describe('It Only Gets Worse', function () {
    describe("It Only Gets Worse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'it-only-gets-worse',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'festering-touch']
                },
                player2: {
                    amber: 4,
                    hand: ['nerve-blast'],
                    inPlay: ['troll', 'hard-simpson']
                }
            });
        });

        it('should fulfill when opponent steals amber during their turn', function () {
            this.player1.activateProphecy(this.itOnlyGetsWorse, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.nerveBlast);
            this.player2.clickCard(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.troll.amber).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when opponent steals amber during your turn', function () {
            this.player1.activateProphecy(this.itOnlyGetsWorse, this.parasiticArachnoid);
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.hardSimpson);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
