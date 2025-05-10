describe('Bad Omen', function () {
    describe("Bad Omen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'bad-omen',
                        'expect-the-unexpected',
                        'fate-laughs-at-your-plans',
                        'forge-ahead-with-confidence'
                    ],
                    hand: ['ancient-bear', 'parasitic-arachnoid'],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    hand: ['spoo-key-charge'],
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should fulfill when opponent has exactly 6 amber at end of their turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            console.log('HERE');
            this.player2.amber = 6;
            this.player2.endTurn();
            expect(this.player2).toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2.amber).toBe(3);
            expect(this.huntingWitch.amber).toBe(3);
        });
    });
});
