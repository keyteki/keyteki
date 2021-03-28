describe('Tautau Vapors', function () {
    describe("Tautau Vapors' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['sanitation-engineer', 'old-yurk'],
                    hand: ['soulkeeper', 'tautau-vapors']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should draw two cards and archive a card when played', function () {
            this.player1.play(this.tautauVapors);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).toHavePrompt('Tautau Vapors');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('archives');
        });
    });
});
