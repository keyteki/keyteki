describe('Abond The Armorsmith', function () {
    describe("Abond the Armorsmith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['abond-the-armorsmith', 'aubade-the-grim', 'bordan-the-redeemed']
                },
                player2: {
                    inPlay: ['sequis', 'commander-remiel', 'raiding-knight', 'champion-anaphiel']
                }
            });
        });
        it('should grant all other friendly creatures +1 armor simply by existing', function () {
            expect(this.aubadeTheGrim.armor).toBe(2);
            expect(this.bordanTheRedeemed.armor).toBe(1);
        });
        it('should grant all other friendly creatures an additional +1 armor when his action ability is used', function () {
            this.player1.clickCard(this.abondTheArmorsmith);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.aubadeTheGrim.armor).toBe(3);
            expect(this.bordanTheRedeemed.armor).toBe(2);
        });
        it('should have his action ability wear off at the end of his turn', function () {
            this.player1.clickCard(this.abondTheArmorsmith);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.aubadeTheGrim.armor).toBe(3);
            expect(this.bordanTheRedeemed.armor).toBe(2);
            this.player1.endTurn();
            expect(this.aubadeTheGrim.armor).toBe(2);
            expect(this.bordanTheRedeemed.armor).toBe(1);
        });
    });
});
