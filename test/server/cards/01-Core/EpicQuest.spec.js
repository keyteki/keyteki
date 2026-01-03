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
                    inPlay: ['gauntlet-of-command', 'nexus']
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
            this.expectReadyToTakeAction(this.player1);
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
            this.expectReadyToTakeAction(this.player1);
        });

        it('should forge a key if played 7 sanctum cards, after opponent used the artifact', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.nexus);
            this.player2.clickCard(this.epicQuest);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            expect(this.epicQuest.exhausted, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('sanctum');
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
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.epicQuest.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
