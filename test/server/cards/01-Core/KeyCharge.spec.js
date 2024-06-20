describe('Key Charge', function () {
    describe("Key Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['key-charge'],
                    inPlay: ['lamindra', 'urchin']
                },
                player2: {
                    inPlay: ['ancient-bear', 'duskwitch', 'niffle-ape']
                }
            });
        });

        it('should not forge a key if there is no amber', function () {
            this.player1.play(this.keyCharge);
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.player1.endTurn();
        });

        it('should lose 1 amber and not forge a key if there is not enough amber left', function () {
            this.player1.player.amber = 4;
            this.player1.play(this.keyCharge);
            expect(this.player1.amber).toBe(3);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.player1.endTurn();
        });

        it('should lose 1 amber and opt not to forge a key if there is enough amber left', function () {
            this.player1.player.amber = 10;
            this.player1.play(this.keyCharge);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('No');
            expect(this.player1.amber).toBe(9);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.player1.endTurn();
        });

        it('should lose 1 amber and opt to forge a key if there is enough amber left', function () {
            this.player1.player.amber = 10;
            this.player1.play(this.keyCharge);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('red');
            expect(this.player1.amber).toBe(3);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            this.player1.endTurn();
        });
    });
});
