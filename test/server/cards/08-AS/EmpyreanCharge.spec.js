describe('Empyrean Charge', function () {
    describe("Empyrean Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    hand: ['empyrean-charge'],
                    archives: ['gub', 'umbra', 'lamindra']
                },
                player2: {
                    archives: ['mark-of-dis', 'control-the-weak', 'infurnace']
                }
            });
        });

        it('should forge a key at 6-len(archives)', function () {
            this.player1.play(this.empyreanCharge);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(4);
            expect(this.player2.player.discard.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard archives even if no key is forged', function () {
            this.player1.amber = 4;
            this.player1.play(this.empyreanCharge);
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(4);
            expect(this.player2.player.discard.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
