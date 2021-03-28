describe('Subtle Chain', function () {
    describe("Subtle Chain's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: [
                        'subtle-chain',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra'
                    ]
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it("Discard random card from opponent's hand", function () {
            this.player1.play(this.subtleChain);

            expect(this.player1.hand.length).toBe(5);
            expect(this.player2.hand.length).toBe(5);
        });
    });
});
