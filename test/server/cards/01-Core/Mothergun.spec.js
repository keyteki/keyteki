describe('Mothergun', function () {
    describe("Mothergun's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'combat-pheromones', 'soft-landing', 'dextre'],
                    inPlay: ['mothergun', 'mindwarper']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.clickCard(this.mothergun);
            this.player1.clickPrompt("Use this card's Action ability");
        });

        it('should prompt the player to reveal cards', function () {
            expect(this.player1).toHavePrompt('Choose which cards to reveal');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).toBeAbleToSelect(this.softLanding);
            expect(this.player1).not.toBeAbleToSelect(this.mothergun);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
        });

        it('should allow the player to select 0 cards', function () {
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal the correct amount of damage', function () {
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickCard(this.softLanding);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Mothergun');
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).not.toBeAbleToSelect(this.softLanding);
            expect(this.player1).not.toBeAbleToSelect(this.mothergun);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
