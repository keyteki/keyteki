describe('Forgemaster Og', function () {
    describe("Forgemaster Og's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['forgemaster-og'],
                    amber: 4
                },
                player2: {
                    amber: 8,
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should trigger when the opponent forges a key, causing them to lose all their remaining amber.', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(4);
        });
        it('should trigger when the controller forges a key, causing them to lose all their remaining amber.', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(4);
            this.player2.amber = 4;
            this.player1.amber = 7;
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
        });
    });
});
