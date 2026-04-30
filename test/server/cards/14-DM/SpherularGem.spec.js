describe('Spherular Gem', function () {
    describe("Spherular Gem's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    inPlay: ['spherular-gem']
                },
                player2: {}
            });
        });

        it('destroys self and gains 1 amber per forged key', function () {
            this.player1.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.useAction(this.spherularGem);
            expect(this.spherularGem.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains 0 with no forged keys', function () {
            this.player1.useAction(this.spherularGem);
            expect(this.spherularGem.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
