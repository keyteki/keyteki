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
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.chelonia.location).toBe('play area');
            expect(this.toad.location).toBe('play area');
            expect(this.chelonia.isToken()).toBe(true);
            expect(this.toad.isToken()).toBe(true);
        });
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
