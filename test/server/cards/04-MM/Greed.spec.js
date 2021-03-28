describe('Greed', function () {
    describe("Greed's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['greed', 'gub', 'desire', 'envy', 'pride'],
                    hand: ['shooler', 'shooler', 'shooler', 'shooler'],
                    amber: 1
                },
                player2: {
                    amber: 2,
                    inPlay: ['wrath']
                }
            });
        });

        it('should add extra 5 cards to hand', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(10);
        });
    });
});
