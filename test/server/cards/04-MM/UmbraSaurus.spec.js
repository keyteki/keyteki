describe('Umbra-Saurus', function () {
    describe("Umbra-Saurus's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['umbra-saurus']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should not deal 3D if not exalted', function () {
            this.player1.play(this.umbraSaurus);
            this.player1.clickPrompt('Done');
            expect(this.umbraSaurus.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 3D if exalted', function () {
            this.player1.play(this.umbraSaurus);
            this.player1.clickCard(this.umbraSaurus);
            this.player1.clickCard(this.troll);
            expect(this.umbraSaurus.amber).toBe(1);
            expect(this.troll.tokens.damage).toBe(3);
        });
    });
});
