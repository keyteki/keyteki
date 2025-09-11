describe('Swift Induction', function () {
    describe("Swift Induction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    token: 'zealot',
                    hand: ['swift-induction'],
                    inPlay: ['snarette', 'charette']
                },
                player2: {
                    amber: 1
                }
            });

            this.zealot1 = this.player1.player.deck[0];
        });

        it('should not archive if the token has no mutant neighbors', function () {
            this.player1.play(this.swiftInduction);
            this.player1.clickPrompt('Right');
            expect(this.zealot1.location).toBe('play area');
            expect(this.swiftInduction.location).toBe('discard');
        });

        it('should archive the token enters play next to a mutant', function () {
            this.player1.play(this.swiftInduction);
            this.player1.clickPrompt('Left');
            expect(this.zealot1.location).toBe('play area');
            expect(this.swiftInduction.location).toBe('archives');
        });
    });
});
