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

        it('should gain 3 amber', function () {
            let AMBER_GAIN = 3;
            let initial_amber = this.player1.amber;

            this.player1.reap(this.zephonTheOpulent);

            expect(this.player1.amber).toBe(initial_amber + AMBER_GAIN);
        });
    });

    describe('if there are less than 2 friendly token creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'cleric',
                    amber: 3,
                    inPlay: ['zephon-the-opulent'],
                    deck: ['chelonia', 'toad']
                },
                player2: {
                    token: 'diplomat',
                    inPlay: ['diplomat:troll', 'diplomat:gub']
                }
            });
        });

        it('should not be usable', function () {
            this.player1.clickCard(this.zephonTheOpulent);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
