describe('Zephon the Opulent', function () {
    describe("'s play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'cleric',
                    amber: 3,
                    hand: ['zephon-the-opulent'],
                    deck: ['chelonia', 'toad']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
        });

        it('should make 2 token creatures');
    });
    describe("'s reap effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    inPlay: ['zephon-the-opulent', 'cleric:chelonia', 'cleric:toad']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
        });

        it('should gain 2 amber');

        it('should be disabled if there are less than 2 friendly token creatures in play');
    });
});
