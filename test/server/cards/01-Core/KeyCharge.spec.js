describe('Key Charge', function () {
    describe("Key Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'untamed',
                    hand: ['key-charge']
                },
                player2: {}
            });
        });

        it('should lose 1 amber and allow forging a key', function () {
            this.player1.play(this.keyCharge);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should lose 1 amber and allow declining to forge', function () {
            this.player1.play(this.keyCharge);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('No');
            expect(this.player1.amber).toBe(6);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should lose 1 amber and not forge without enough amber', function () {
            this.player1.amber = 6;
            this.player1.play(this.keyCharge);
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
