describe('Combat Pheromones', function () {
    describe("Combat Pheromones's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['commander-remiel', 'mindwarper', 'crystal-hive', 'combat-pheromones'],
                    hand: ['inspiration']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });

        it('should allow using a Mars creature', function () {
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Combat Pheromones');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.grabberJammer);
            expect(this.player1).toBeAbleToSelect(this.crystalHive);
            this.player1.clickCard(this.mindwarper);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.mindwarper);
            expect(this.player1).toHavePrompt('Mindwarper');
        });

        it('should allow using an artifact', function () {
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.crystalHive);
            this.player1.clickCard(this.mindwarper);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.crystalHive);
            expect(this.player1).toHavePrompt('Crystal Hive');
        });
    });
});
