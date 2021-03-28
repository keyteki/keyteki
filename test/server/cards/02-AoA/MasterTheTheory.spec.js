describe('Master The Theory', function () {
    describe("Master The Theory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['master-the-theory', 'combat-pheromones', 'soft-landing', 'dextre'],
                    inPlay: []
                },
                player2: {
                    inPlay: ['mindwarper', 'zorg']
                }
            });
        });

        it('should prompt the player to select cards', function () {
            this.player1.play(this.masterTheTheory);
            expect(this.player1).toHavePrompt('Choose 2 cards');
            expect(this.player1).toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).toBeAbleToSelect(this.softLanding);
            expect(this.player1).toBeAbleToSelect(this.dextre);
        });

        it('should allow the player to select 0 cards', function () {
            this.player1.play(this.masterTheTheory);
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
        });

        it('should archive the 2 of their cards', function () {
            this.player1.play(this.masterTheTheory);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt('Done');
            expect(this.dextre.location).toBe('archives');
            expect(this.combatPheromones.location).toBe('archives');
            expect(this.player1.hand.length).toBe(1);
        });

        it('should archive the 1 of their cards', function () {
            this.player1.play(this.masterTheTheory);
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt('Done');
            expect(this.combatPheromones.location).toBe('archives');
            expect(this.player1.hand.length).toBe(2);
        });
    });
});
