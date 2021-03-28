describe('Nogi Smartfist', function () {
    describe("Nogi Smartfist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['nogi-smartfist']
                },
                player2: {
                    inPlay: ['duskwitch'],
                    hand: ['foggify']
                }
            });
        });

        it('should draw 2 cards and discard 2 cards when fight', function () {
            this.player1.fightWith(this.nogiSmartfist, this.duskwitch);
            expect(this.player1.discard.length).toBe(2);
        });
    });
});
