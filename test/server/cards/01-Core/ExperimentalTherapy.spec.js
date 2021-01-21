describe('Experimental Therapy', function () {
    describe("Experimental Therapy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['zorg', 'archimedes'],
                    hand: ['experimental-therapy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("should stun, exhaust and not change controller's creature house", function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.zorg);
            expect(this.experimentalTherapy.location).toBe('play area');
            expect(this.zorg.upgrades).toContain(this.experimentalTherapy);
            expect(this.zorg.exhausted).toBe(true);
            expect(this.zorg.stunned).toBe(true);
            expect(this.zorg.hasHouse('brobnar')).toBe(false);
            expect(this.zorg.hasHouse('dis')).toBe(false);
            expect(this.zorg.hasHouse('logos')).toBe(false);
            expect(this.zorg.hasHouse('mars')).toBe(true);
            expect(this.zorg.hasHouse('sanctum')).toBe(false);
            expect(this.zorg.hasHouse('shadows')).toBe(false);
            expect(this.zorg.hasHouse('untamed')).toBe(false);
        });

        it("should stun, exhaust and not change opponent's creature house", function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.troll);
            expect(this.experimentalTherapy.location).toBe('play area');
            expect(this.troll.upgrades).toContain(this.experimentalTherapy);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.stunned).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(true);
            expect(this.troll.hasHouse('dis')).toBe(false);
            expect(this.troll.hasHouse('logos')).toBe(false);
            expect(this.troll.hasHouse('mars')).toBe(false);
            expect(this.troll.hasHouse('sanctum')).toBe(false);
            expect(this.troll.hasHouse('shadows')).toBe(false);
            expect(this.troll.hasHouse('untamed')).toBe(false);
        });

        it('should allow using the creature as if it belongs to current house', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.zorg);
            expect(this.zorg.exhausted).toBe(true);
            expect(this.zorg.stunned).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.zorg.exhausted).toBe(true);
            expect(this.zorg.stunned).toBe(false);
        });
    });
});
