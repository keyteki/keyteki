describe('Experimental Therapy', function () {
    describe("Experimental Therapy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['zorg'],
                    hand: ['experimental-therapy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("should stun, exhaust and make its controller's creature belong to all houses", function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.zorg);
            expect(this.experimentalTherapy.location).toBe('play area');
            expect(this.zorg.upgrades).toContain(this.experimentalTherapy);
            expect(this.zorg.exhausted).toBe(true);
            expect(this.zorg.stunned).toBe(true);
            expect(this.zorg.hasHouse('brobnar')).toBe(true);
            expect(this.zorg.hasHouse('dis')).toBe(true);
            expect(this.zorg.hasHouse('logos')).toBe(true);
            expect(this.zorg.hasHouse('mars')).toBe(true);
            expect(this.zorg.hasHouse('sanctum')).toBe(true);
            expect(this.zorg.hasHouse('shadows')).toBe(true);
            expect(this.zorg.hasHouse('untamed')).toBe(true);
        });

        it("should stun, exhaust and make an opponent's creature belong to all houses", function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.troll);
            expect(this.experimentalTherapy.location).toBe('play area');
            expect(this.troll.upgrades).toContain(this.experimentalTherapy);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.stunned).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(true);
            expect(this.troll.hasHouse('dis')).toBe(true);
            expect(this.troll.hasHouse('logos')).toBe(true);
            expect(this.troll.hasHouse('mars')).toBe(true);
            expect(this.troll.hasHouse('sanctum')).toBe(true);
            expect(this.troll.hasHouse('shadows')).toBe(true);
            expect(this.troll.hasHouse('untamed')).toBe(true);
        });
    });
});
