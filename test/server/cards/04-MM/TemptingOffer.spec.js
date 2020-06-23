describe('Tempting Offer', function () {
    describe("Tempting Offer's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['reckless-rizzo'],
                    hand: ['tempting-offer'],
                    amber: 1
                },
                player2: {
                    inPlay: ['lamindra'],
                    amber: 3
                }
            });
        });

        it("should return an enemy creature to opponent's hand and opponent should gain 1A", function () {
            this.player1.play(this.temptingOffer);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.recklessRizzo);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('hand');
            expect(this.player2.amber).toBe(4);
        });

        it("should fail to return a warded enemy creature to opponent's hand and opponent should not gain 1A", function () {
            this.lamindra.tokens.ward = 1;
            this.player1.play(this.temptingOffer);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.recklessRizzo);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('play area');
            expect(this.lamindra.tokens.ward).toBeUndefined();
            expect(this.player2.amber).toBe(3);
        });

        it('should not give 1A to opponent if no enemy creature is in play', function () {
            this.player2.moveCard(this.lamindra, 'discard');
            this.player1.play(this.temptingOffer);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.recklessRizzo);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
        });
    });
});
