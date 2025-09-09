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
                    hand: [
                        'troll',
                        'anger',
                        'follow-the-leader',
                        'wild-wormhole',
                        'poke',
                        'came-back-wrong',
                        'reclaimed-by-nature'
                    ],
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

        it('should fulfill when opponent plays their second action from Wild Wormhole', function () {
            this.player1.activateProphecy(this.treatEachActionAsYourLast, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.followTheLeader, 'deck');
            this.player2.play(this.poke);
            this.player2.play(this.wildWormhole);
            this.player2.clickPrompt(this.wildWormhole.name);
            this.player2.clickPrompt(this.followTheLeader.name);
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(4);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fulfill when opponent plays an action that changes type', function () {
            this.player1.activateProphecy(this.treatEachActionAsYourLast, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.reclaimedByNature);
            this.player2.clickCard(this.rowdySkald);
            this.player2.moveCard(this.troll, 'discard');
            this.player2.play(this.cameBackWrong);
            this.player2.clickPrompt(this.cameBackWrong.name);
            this.player2.clickCard(this.troll);
            this.player2.clickPrompt('Right');
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(3);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
