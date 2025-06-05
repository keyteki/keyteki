describe('Treat Each Action as Your Last', function () {
    describe("Treat Each Action as Your Last's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'treat-each-action-as-your-last',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid']
                },
                player2: {
                    amber: 4,
                    hand: ['troll', 'anger', 'follow-the-leader'],
                    inPlay: ['rowdy-skald']
                }
            });
        });

        it('should fulfill when opponent plays their second action', function () {
            this.player1.activateProphecy(this.treatEachActionAsYourLast, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.anger);
            this.player2.clickCard(this.rowdySkald);
            this.player2.playCreature(this.troll);
            this.player2.play(this.followTheLeader);
            this.player2.clickPrompt(this.followTheLeader.name);
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(3);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
