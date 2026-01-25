describe('Smiling Ruth', function () {
    describe("Smiling Ruth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'mars',
                    inPlay: ['zorg', 'niffle-ape', 'lamindra'],
                    hand: ['hypnobeam']
                },
                player2: {
                    inPlay: ['smiling-ruth'],
                    hand: ['key-charge', 'ghosthawk']
                }
            });
        });

        it('should not take control of an enemy creature if not forged a key this turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.smilingRuth);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });

        it('should take control of an enemy flank creature and use it immediately', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.smilingRuth);
            expect(this.player2).toBeAbleToSelect(this.zorg);
            expect(this.player2).toBeAbleToSelect(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.niffleApe);
            this.player2.clickCard(this.lamindra);
            this.player2.clickPrompt('Left');
            expect(this.lamindra.controller).toBe(this.player2.player);
            expect(this.lamindra.hasHouse('shadows')).toBe(true);
            this.player2.reap(this.lamindra);
            expect(this.player2.amber).toBe(2);
            this.player2.endTurn();
        });

        it('should take control of an enemy flank non-shadows creature', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.smilingRuth);
            expect(this.player2).toBeAbleToSelect(this.zorg);
            expect(this.player2).toBeAbleToSelect(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.niffleApe);
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt('Left');
            expect(this.zorg.controller).toBe(this.player2.player);
            expect(this.zorg.hasHouse('mars')).toBe(true);
            expect(this.zorg.hasHouse('shadows')).toBe(false);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });

        it('should take control of an enemy flank creature if forged using key charge', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 7;
            this.player2.play(this.keyCharge);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('Red');
            this.player2.play(this.ghosthawk);
            this.player2.clickCard(this.smilingRuth);
            expect(this.player2).toBeAbleToSelect(this.zorg);
            expect(this.player2).toBeAbleToSelect(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.niffleApe);
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt('Left');
            expect(this.zorg.controller).toBe(this.player2.player);
            expect(this.zorg.hasHouse('mars')).toBe(true);
            expect(this.zorg.hasHouse('shadows')).toBe(false);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });
    });
});
