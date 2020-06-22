describe('Epic Quest', function () {
    describe("Epic Quest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['epic-quest'],
                    hand: [
                        'sequis',
                        'clear-mind',
                        'glorious-few',
                        'virtuous-works',
                        'gorm-of-omm',
                        'round-table',
                        'protectrix'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'gauntlet-of-command']
                }
            });
        });

        it('should not forge a key if played 6 or less sanctum cards', function () {
            this.player1.play(this.sequis);
            this.player1.play(this.clearMind);
            this.player1.play(this.gloriousFew);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.protectrix);
            this.player1.play(this.gormOfOmm);
            expect(this.player1.amber).toBe(4);
            this.player1.useAction(this.epicQuest, true);
            expect(this.epicQuest.location).toBe('play area');
            expect(this.epicQuest.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should forge a key if played 7 sanctum cards', function () {
            this.player1.play(this.sequis);
            this.player1.play(this.clearMind);
            this.player1.play(this.gloriousFew);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.protectrix);
            this.player1.play(this.gormOfOmm);
            this.player1.play(this.roundTable);
            expect(this.player1.amber).toBe(5);
            this.player1.useAction(this.epicQuest, true);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.epicQuest.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
