describe('Beam of Forgetting', function () {
    describe("Beam of Forgetting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['beam-of-forgetting']
                },
                player2: {
                    hand: ['selwyn-the-fence']
                }
            });
        });

        it('allows player to put a random card from opponent hand on the bottom of their deck', function () {
            this.player1.play(this.beamOfForgetting);
            expect(this.selwynTheFence.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(
                this.selwynTheFence
            );
        });
    });
});
