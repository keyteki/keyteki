describe('Punctuated Equilibrium', function () {
    describe("Punctuated Equilibrium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: [
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'bad-penny',
                        'punctuated-equilibrium'
                    ]
                },
                player2: {}
            });
        });

        it('should refill to 6 cards.', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });

        it('should refill to less than 6 cards with chains.', function () {
            this.player1.chains = 1;
            this.player2.chains = 7;
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1.hand.length).toBe(5);
            expect(this.player2.hand.length).toBe(4);
            expect(this.player1.chains).toBe(0);
            expect(this.player2.chains).toBe(6);
        });
    });
});
