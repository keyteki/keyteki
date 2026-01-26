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

        it('should last until the end of the turn', function () {
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.mindwarper);
            this.player1.clickPrompt('Done');
            this.player1.reap(this.mindwarper);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('Sanctum');
            this.player1.clickCard(this.mindwarper);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Combat Pheromones with destroyed and returned cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['combat-pheromones', 'dr-xyloxxzlphrex', 'ixxyxli-fixfinger']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not allow using a card that was destroyed and returned to play', function () {
            // Use Combat Pheromones to allow using Dr. Xyloxxzlphrex and Ixxyxli Fixfinger
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.drXyloxxzlphrex);
            this.player1.clickCard(this.ixxyxliFixfinger);
            this.player1.clickPrompt('Done');

            // Destroy Fixfinger
            this.player1.fightWith(this.ixxyxliFixfinger, this.troll);
            expect(this.ixxyxliFixfinger.location).toBe('discard');

            // Reap with Dr. Xyloxxzlphrex to bring back Fixfinger
            this.player1.reap(this.drXyloxxzlphrex);
            this.player1.clickCard(this.ixxyxliFixfinger);
            this.player1.clickPrompt('Left');
            expect(this.ixxyxliFixfinger.location).toBe('play area');
            expect(this.ixxyxliFixfinger.exhausted).toBe(false);

            // Fixfinger should NOT be usable via Combat Pheromones anymore
            // because it's a new creature instance
            this.player1.clickCard(this.ixxyxliFixfinger);
            expect(this.player1).not.toHavePrompt('Ixxyxli Fixfinger');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
