describe('Blinding Light', function () {
    describe("Blinding Light's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['blinding-light'],
                    inPlay: ['ancient-bear', 'sequis']
                },
                player2: {
                    hand: ['rocket-boots'],
                    inPlay: ['mindwarper', 'zorg', 'champion-anaphiel']
                }
            });
        });

        it('should prompt to choose a house', function () {
            this.player1.play(this.blindingLight);
            expect(this.player1).toHavePrompt('Blinding Light');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
        });

        it('should stun Mars cards when Mars is selected', function () {
            this.player1.play(this.blindingLight);
            this.player1.clickPrompt('mars');
            expect(this.mindwarper.stunned).toBe(true);
            expect(this.zorg.stunned).toBe(true);
            expect(this.championAnaphiel.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.sequis.stunned).not.toBe(true);
        });

        it('should stun Sanctum cards when Sanctum is selected', function () {
            this.player1.play(this.blindingLight);
            this.player1.clickPrompt('sanctum');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.championAnaphiel.stunned).toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.sequis.stunned).toBe(true);
        });

        it('should stun Untamed cards when Untamed is selected', function () {
            this.player1.play(this.blindingLight);
            this.player1.clickPrompt('untamed');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.championAnaphiel.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).toBe(true);
            expect(this.sequis.stunned).not.toBe(true);
        });

        it('should stun no cards when Dis is selected', function () {
            this.player1.play(this.blindingLight);
            this.player1.clickPrompt('dis');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.championAnaphiel.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.sequis.stunned).not.toBe(true);
        });

        it('should not stun creatures with an upgrade which matches the chosen house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playUpgrade(this.rocketBoots, this.championAnaphiel);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.play(this.blindingLight);
            this.player1.clickPrompt('logos');
            expect(this.championAnaphiel.stunned).toBe(false);
        });
    });
});
