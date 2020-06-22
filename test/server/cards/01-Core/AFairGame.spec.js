describe('A Fair Game', function () {
    describe("A Fair Game's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['a-fair-game', 'pitlord', 'arise', 'dextre', 'doc-bookton'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });

        it('should give each player the correct amount of amber when discarding a card which matches', function () {
            this.player1.moveCard(this.tocsin, 'deck');
            this.player2.moveCard(this.flaxia, 'deck');
            this.player1.play(this.aFairGame);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });

        it("should give the correct amount when one player doesn't have a matching card", function () {
            this.player1.moveCard(this.tocsin, 'deck');
            this.player2.moveCard(this.nexus, 'deck');
            this.player1.play(this.aFairGame);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should not discard a card when the discard is empty, and should give no amber', function () {
            for (let card of this.player1.player.deck) {
                this.player1.moveCard(card, 'discard');
            }

            this.player2.moveCard(this.flaxia, 'deck');
            this.player1.play(this.aFairGame);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
        });
    });
});
