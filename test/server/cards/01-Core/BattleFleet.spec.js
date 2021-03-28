describe('Battle Fleet', function () {
    describe("Battle Fleet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['battle-fleet', 'zorg', 'combat-pheromones', 'soft-landing', 'dextre'],
                    inPlay: ['mindwarper']
                },
                player2: {
                    inPlay: []
                }
            });
            this.player1.play(this.battleFleet);
        });

        it('should prompt the player to reveal cards', function () {
            expect(this.player1).toHavePrompt('Choose which cards to reveal');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).toBeAbleToSelect(this.softLanding);
            expect(this.player1).not.toBeAbleToSelect(this.battleFleet);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
        });

        it('should allow the player to select 0 cards', function () {
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should draw the correct number of cards', function () {
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickCard(this.softLanding);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.hand.length).toBe(7);
        });
    });
});
