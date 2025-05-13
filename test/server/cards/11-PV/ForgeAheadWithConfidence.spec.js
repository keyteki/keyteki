describe('Forge Ahead With Confidence', function () {
    describe("Forge Ahead With Confidence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'forge-ahead-with-confidence',
                        'expect-the-unexpected',
                        'fate-laughs-at-your-plans',
                        'bad-omen'
                    ],
                    hand: ['ancient-bear', 'parasitic-arachnoid'],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    amber: 12,
                    hand: ['spoo-key-charge'],
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should fulfill when opponent forges a key', function () {
            this.player1.activateProphecy(this.forgeAheadWithConfidence, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            expect(this.player2).toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2.amber).toBe(4);
            expect(this.huntingWitch.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should not fulfill when you forge a key', function () {
            this.player1.activateProphecy(this.forgeAheadWithConfidence, this.parasiticArachnoid);
            this.player1.amber = 6;
            this.player2.amber = 5;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
        });
    });
});
