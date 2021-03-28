describe('Information Officer Gray', function () {
    describe("Information Officer Gray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: [
                        'zorg',
                        'information-officer-gray',
                        'combat-pheromones',
                        'soft-landing',
                        'dextre',
                        'lieutenant-khrkhar'
                    ],
                    inPlay: ['mothergun', 'mindwarper']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should prompt the player to reveal a card and archive the selected card', function () {
            this.player1.play(this.informationOfficerGray);
            expect(this.player1).toHavePrompt('Information Officer Gray');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).toBeAbleToSelect(this.softLanding);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this.dextre.location).toBe('archives');
        });

        it('should allow the player to select 0 cards', function () {
            this.player1.play(this.informationOfficerGray);
            expect(this.player1).toHavePrompt('Information Officer Gray');
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
