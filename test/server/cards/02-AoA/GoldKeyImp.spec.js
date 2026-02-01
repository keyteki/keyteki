describe('Gold Key Imp', function () {
    describe("Gold Key Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 6,
                    inPlay: ['gold-key-imp']
                },
                player2: {
                    amber: 6
                }
            });
            this.player1.forgeKey('Red');
            this.player1.forgeKey('Blue');
            this.player2.forgeKey('Red');
            this.player2.forgeKey('Blue');
        });

        it('should prevent players from forging their third key', function () {
            this.player1.endTurn();
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player1.amber).toBe(6);

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(2);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).hasPrompt('Choose which house you want to activate this turn');
        });
    });
});
