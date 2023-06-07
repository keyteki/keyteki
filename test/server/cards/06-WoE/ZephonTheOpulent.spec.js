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

        it('should make 2 token creatures', function () {
            this.player1.playCreature(this.zephonTheOpulent);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');

            let creatures = this.player1.player.creaturesInPlay;

            expect(creatures.length).toBe(3);

            expect(creatures[1].isToken()).toBe(true);
            expect(creatures[2].isToken()).toBe(true);
        });
    });
    describe("'s reap effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'cleric',
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
