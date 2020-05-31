describe('Orbital Bombardment', function () {
    integration(function () {
        describe("Orbital Bombardment's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'mars',
                        hand: [
                            'orbital-bombardment',
                            'zorg',
                            'combat-pheromones',
                            'soft-landing',
                            'dextre'
                        ],
                        inPlay: ['mothergun', 'mindwarper']
                    },
                    player2: {
                        inPlay: ['troll', 'snufflegator']
                    }
                });
                this.player1.play(this.orbitalBombardment);
            });

            it('should prompt the player to reveal cards', function () {
                expect(this.player1).toHavePrompt('Choose which cards to reveal');
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.combatPheromones);
                expect(this.player1).toBeAbleToSelect(this.softLanding);
                expect(this.player1).not.toBeAbleToSelect(this.orbitalBombardment);
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
                expect(this.player1).toHavePrompt('Orbital Bombardment');
                expect(this.player1).not.toBeAbleToSelect(this.zorg);
                expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
                expect(this.player1).not.toBeAbleToSelect(this.softLanding);
                expect(this.player1).not.toBeAbleToSelect(this.mothergun);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.mindwarper);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Orbital Bombardment');
                expect(this.player1).toBeAbleToSelect(this.mindwarper);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Orbital Bombardment');
                expect(this.player1).toBeAbleToSelect(this.mindwarper);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                this.player1.clickCard(this.snufflegator);
                expect(this.troll.tokens.damage).toBe(4);
                expect(this.snufflegator.tokens.damage).toBe(2);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
