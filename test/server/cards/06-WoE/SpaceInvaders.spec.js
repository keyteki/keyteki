describe('Space Invaders', function () {
    describe("Space Invaders's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: [
                        'space-invaders',
                        'zorg',
                        'combat-pheromones',
                        'pelf',
                        'bumpsy',
                        'vow-of-blood'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'snufflegator']
                }
            });
        });

        it('should prompt the player to reveal cards', function () {
            this.player1.play(this.spaceInvaders);
            expect(this.player1).toHavePrompt('Choose which cards to reveal');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).not.toBeAbleToSelect(this.vowOfBlood);
        });

        it('should allow the player to select 0 cards', function () {
            this.player1.play(this.spaceInvaders);
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make the correct amount of tokens', function () {
            this.player1.play(this.spaceInvaders);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.name).toBe('Grumpus');
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.name).toBe('Grumpus');
        });

        it('should make a single token', function () {
            this.player1.play(this.spaceInvaders);
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.name).toBe('Grumpus');
            expect(this.pelf.location).toBe('hand');
        });
    });
});
