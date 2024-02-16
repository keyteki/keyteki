describe('Unprepared', function () {
    describe("Unprepared's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['unprepared'],
                    inPlay: ['ancient-bear', 'cpo-zytar']
                },
                player2: {
                    hand: ['rocket-boots'],
                    inPlay: ['mindwarper', 'zorg', 'medic-ingram']
                }
            });
        });

        it('should prompt to choose a house', function () {
            this.player1.play(this.unprepared);
            expect(this.player1).toHavePrompt('Unprepared');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
            expect(this.player1.currentButtons).toContain('unfathomable');
            expect(this.player1.currentButtons).toContain('ekwidon');
        });

        it('should stun Mars cards when Mars is selected', function () {
            this.player1.play(this.unprepared);
            this.player1.clickPrompt('mars');
            expect(this.mindwarper.stunned).toBe(true);
            expect(this.zorg.stunned).toBe(true);
            expect(this.medicIngram.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.cpoZytar.stunned).not.toBe(true);
        });

        it('should stun Star Alliance cards when Sanctum is selected', function () {
            this.player1.play(this.unprepared);
            this.player1.clickPrompt('staralliance');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.medicIngram.stunned).toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.cpoZytar.stunned).toBe(true);
        });

        it('should stun Untamed cards when Untamed is selected', function () {
            this.player1.play(this.unprepared);
            this.player1.clickPrompt('untamed');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.medicIngram.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).toBe(true);
            expect(this.cpoZytar.stunned).not.toBe(true);
        });

        it('should stun no cards when Dis is selected', function () {
            this.player1.play(this.unprepared);
            this.player1.clickPrompt('dis');
            expect(this.mindwarper.stunned).not.toBe(true);
            expect(this.zorg.stunned).not.toBe(true);
            expect(this.medicIngram.stunned).not.toBe(true);
            expect(this.ancientBear.stunned).not.toBe(true);
            expect(this.cpoZytar.stunned).not.toBe(true);
        });

        it('should not stun creatures with an upgrade which matches the chosen house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playUpgrade(this.rocketBoots, this.medicIngram);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.unprepared);
            this.player1.clickPrompt('logos');
            expect(this.medicIngram.stunned).toBe(false);
        });
    });
});
