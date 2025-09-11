describe('Jackpot Greene', function () {
    describe("Jackpot Greene's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['jackpot-greene', 'cpo-zytar'],
                    discard: ['rogue-operation', 'poke']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie', 'hunting-witch'],
                    discard: ['quintrino-warp', 'full-moon']
                }
            });
        });

        it('gives reap ability to friendly creatures', function () {
            this.player1.moveCard(this.poke, 'deck');
            this.player1.moveCard(this.rogueOperation, 'deck');
            this.player1.reap(this.jackpotGreene);
            expect(this.player1.amber).toBe(3);
            expect(this.rogueOperation.location).toBe('discard');
            this.player1.reap(this.cpoZytar);
            expect(this.player1.amber).toBe(4);
            expect(this.poke.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
        });

        it('gives reap ability to enemy creatures', function () {
            this.player2.moveCard(this.fullMoon, 'deck');
            this.player2.moveCard(this.quintrinoWarp, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.dustPixie);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.quintrinoWarp.location).toBe('discard');
            this.player2.reap(this.huntingWitch);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.fullMoon.location).toBe('discard');
        });

        it('does nothing with an empty deck', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.jackpotGreene);
            expect(this.player1.amber).toBe(2);
            expect(this.player1.player.deck.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(2);
        });
    });
});
