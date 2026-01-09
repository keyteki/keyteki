describe('Tails, You Lose', function () {
    describe("Tails, You Lose's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'tails-you-lose',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    hand: ['troll'],
                    inPlay: ['rowdy-skald', 'hard-simpson']
                }
            });
        });

        it('should fulfill when opponent plays a creature adjacent to a creature of a different house', function () {
            this.player1.activateProphecy(this.tailsYouLose, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when opponent plays a creature adjacent to a creature of the same house', function () {
            this.player1.activateProphecy(this.tailsYouLose, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll, true);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow flipping at the end of your turn', function () {
            this.player1.activateProphecy(this.tailsYouLose, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickCard(this.tailsYouLose);
            expect(this.tailsYouLose.activeProphecy).toBe(false);
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.parasiticArachnoid.parent).toBe(this.expectTheUnexpected);
            this.player2.clickPrompt('brobnar');
        });
    });
});
