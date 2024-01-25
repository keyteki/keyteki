describe('Anachronometer', function () {
    describe("Anachronometer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['anachronometer'],
                    inPlay: ['cpo-zytar'],
                    discard: ['poke']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    discard: ['faust-the-great', 'spoils-of-battle', 'tremor']
                }
            });
        });

        it('can shuffle your discard pile, draw a card, and discard X cards on reap', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.playUpgrade(this.anachronometer, this.cpoZytar);
            this.player1.reap(this.cpoZytar);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1.player.discard.length).toBe(3);
        });

        it('can shuffle your discard pile, draw a card, and discard X cards on fight', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.playUpgrade(this.anachronometer, this.cpoZytar);
            this.player1.fightWith(this.cpoZytar, this.dustPixie);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1.player.discard.length).toBe(4);
        });
    });
});
