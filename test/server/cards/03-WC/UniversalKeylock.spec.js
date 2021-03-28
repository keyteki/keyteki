describe('Universal Keylock', function () {
    describe("Universal Keylock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 9,
                    house: 'logos',
                    inPlay: ['universal-keylock']
                },
                player2: {
                    amber: 6,
                    hand: ['mother']
                }
            });
        });
        it('should increase key cost by 3 for either player and destroy itself when a key is forged.', function () {
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(6);
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
            expect(this.universalKeylock.location).toBe('discard');
        });
    });
    describe("Universal Keylock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'logos',
                    inPlay: ['universal-keylock']
                },
                player2: {
                    amber: 9,
                    hand: ['mother']
                }
            });
        });
        it('should increase key cost by 3 for either player and destroy itself when a key is forged.', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(0);
            this.player2.clickPrompt('logos');
            expect(this.universalKeylock.location).toBe('discard');
        });
    });
});
