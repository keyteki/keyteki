describe('Skeleton Key', function () {
    describe("Skeleton Key's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nexus'],
                    inPlay: ['skeleton-key']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should capture 1 amber', function () {
            this.player1.play(this.nexus);
            this.player1.clickCard(this.skeletonKey);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.nexus);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.nexus.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture an amber when there are no creatures in play', function () {
            this.player1.clickCard(this.skeletonKey);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture an amber when the opponent has 0', function () {
            this.player2.amber = 0;
            this.player1.play(this.nexus);
            this.player1.clickCard(this.skeletonKey);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.nexus.hasToken('amber')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
