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
                    hand: ['troll', 'recklessness', 'dust-pixie'],
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
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fulfill once when opponent discards multiple cards', function () {
            this.player1.activateProphecy(this.wastefulRegret, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.recklessness);
            this.player2.clickCard(this.wastefulRegret);
            this.player2.clickCard(this.dustPixie); // which discard triggers it?
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(3);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
