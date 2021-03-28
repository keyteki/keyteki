describe('Mole', function () {
    describe("Mole 's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'shadows',
                    inPlay: ['senator-shrix'],
                    hand: ['mole']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should allow opponent to use amber on own creature', function () {
            this.senatorShrix.tokens.amber = 4;
            this.player1.playUpgrade(this.mole, this.senatorShrix);
            this.player1.endTurn();

            this.player2.clickPrompt(4);
            this.player2.forgeKey('red');

            expect(this.player2.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.senatorShrix.amber).toBe(0);
        });
    });
});
