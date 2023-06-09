describe('EchoReflector', function () {
    describe("EchoReflector's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['echo-reflector'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 6,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should prevent forging for 6', function () {
            this.player1.playUpgrade(this.echoReflector, this.flaxia);
            this.player1.endTurn();

            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
            this.player2.clickPrompt('dis');

            this.player2.endTurn();
        });

        it('should allow forging for 9', function () {
            this.player2.amber = 9;
            this.player1.playUpgrade(this.echoReflector, this.flaxia);
            this.player1.endTurn();

            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
            this.player2.clickPrompt('dis');

            this.player2.endTurn();
        });
    });
});
