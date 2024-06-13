describe('Key of Darkness', function () {
    describe("Key of Darkness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 12,
                    hand: ['urchin', 'key-of-darkness']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should forge a key at +6 cost', function () {
            this.player1.play(this.keyOfDarkness);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
        });

        it('should forge a key at +2 cost if opponent has no amber', function () {
            this.player1.play(this.urchin);
            expect(this.player1.amber).toBe(13);
            expect(this.player2.amber).toBe(0);
            this.player1.play(this.keyOfDarkness);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(5);
        });

        it("should not forge a key if the player doesn't have sufficient amber", function () {
            this.player1.amber = 9;
            this.player1.play(this.keyOfDarkness);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(9);
        });
    });
});
