describe('Render Guilt', function () {
    describe("Render Guilt's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'blypyp'],
                    hand: ['render-guilt']
                },
                player2: {
                    amber: 6,
                    inPlay: ['dust-pixie', 'silvertooth']
                }
            });
        });

        it('should capture 1 amber from opponent and deal damage based on amber on creature', function () {
            this.player1.play(this.renderGuilt);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);

            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(5);

            // Should prompt for damage allocation (1 damage for the 1 amber on troll)
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);

            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should deal damage based on total amber on the creature after capture', function () {
            // Add some amber to troll first
            this.troll.tokens.amber = 2;

            this.player1.play(this.renderGuilt);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.amber).toBe(3); // 2 + 1 captured
            expect(this.player2.amber).toBe(5);

            // Should prompt for damage allocation (3 damage for the 3 amber on troll)
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.silvertooth);
            this.player1.clickCard(this.troll);

            expect(this.dustPixie.location).toBe('discard');
            expect(this.silvertooth.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not deal damage if creature has no amber after capture', function () {
            this.player2.amber = 0;
            this.player1.play(this.renderGuilt);
            this.player1.clickCard(this.blypyp);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
