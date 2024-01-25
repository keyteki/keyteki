describe('Hukaru Icefin', function () {
    describe("Hukaru Icefin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hukaru-icefin'],
                    inPlay: ['ancient-bear', 'cpo-zytar']
                },
                player2: {
                    hand: ['rocket-boots'],
                    inPlay: ['mindwarper', 'zorg', 'medic-ingram', 'transporter-platform']
                }
            });
        });

        describe('on reap', function () {
            beforeEach(function () {
                this.player1.playCreature(this.hukaruIcefin);
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
                this.player1.reap(this.hukaruIcefin);
            });

            it('should prompt to choose a house on reap', function () {
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

            it('should exhaust Mars cards when Mars is selected', function () {
                this.player1.clickPrompt('mars');
                expect(this.mindwarper.exhausted).toBe(true);
                expect(this.zorg.exhausted).toBe(true);
                expect(this.medicIngram.exhausted).not.toBe(true);
                expect(this.ancientBear.exhausted).not.toBe(true);
                expect(this.cpoZytar.exhausted).not.toBe(true);
            });

            it('should exhaust Star Alliance cards when Sanctum is selected', function () {
                this.player1.clickPrompt('staralliance');
                expect(this.mindwarper.exhausted).not.toBe(true);
                expect(this.zorg.exhausted).not.toBe(true);
                expect(this.medicIngram.exhausted).toBe(true);
                expect(this.ancientBear.exhausted).not.toBe(true);
                expect(this.cpoZytar.exhausted).toBe(true);
            });

            it('should exhaust Untamed cards when Untamed is selected', function () {
                this.player1.clickPrompt('untamed');
                expect(this.mindwarper.exhausted).not.toBe(true);
                expect(this.zorg.exhausted).not.toBe(true);
                expect(this.medicIngram.exhausted).not.toBe(true);
                expect(this.ancientBear.exhausted).toBe(true);
                expect(this.cpoZytar.exhausted).not.toBe(true);
            });

            it('should stun no cards when Dis is selected', function () {
                this.player1.clickPrompt('dis');
                expect(this.mindwarper.exhausted).not.toBe(true);
                expect(this.zorg.exhausted).not.toBe(true);
                expect(this.medicIngram.exhausted).not.toBe(true);
                expect(this.ancientBear.exhausted).not.toBe(true);
                expect(this.cpoZytar.exhausted).not.toBe(true);
            });
        });

        it('should exhaust a creature on scrap', function () {
            this.player1.scrap(this.hukaruIcefin);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.transporterPlatform);
            expect(this.zorg.exhausted).toBe(false);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.exhausted).toBe(true);
        });

        it('should exhaust an artifact on scrap', function () {
            this.player1.clickCard(this.hukaruIcefin);
            this.player1.clickPrompt('Discard this card');
            expect(this.transporterPlatform.exhausted).toBe(false);
            this.player1.clickCard(this.transporterPlatform);
            expect(this.transporterPlatform.exhausted).toBe(true);
        });
    });
});
