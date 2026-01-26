describe('Wasteful Regret', function () {
    describe("Wasteful Regret's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'wasteful-regret',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    hand: ['troll', 'recklessness', 'mindfire'],
                    inPlay: ['rowdy-skald']
                }
            });
        });

        it('should fulfill when opponent discards a card from hand', function () {
            this.player1.activateProphecy(this.wastefulRegret, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.scrap(this.troll);
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(2);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should fulfill once when opponent discards multiple cards', function () {
            this.player1.activateProphecy(this.wastefulRegret, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.recklessness);
            // Both players have cards to discard, so we get prompted for order
            expect(this.player2).toHavePrompt('Choose which player discards first');
            this.player2.clickPrompt('Me');
            this.player2.clickCard(this.wastefulRegret);
            this.player2.clickCard(this.mindfire); // which discard triggers it?
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(3);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not trigger when opponent discards card from your hand', function () {
            this.player1.activateProphecy(this.wastefulRegret, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.mindfire);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
