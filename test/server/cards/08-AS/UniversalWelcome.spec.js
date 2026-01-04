describe('Universal Welcome', function () {
    describe("Universal Welcome's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'skyborn',
                    hand: ['universal-welcome'],
                    inPlay: ['charette']
                },
                player2: {
                    inPlay: ['dust-pixie', 'hunting-witch', 'flaxia']
                }
            });
        });

        it('should take control of opponent center creature', function () {
            this.player1.play(this.universalWelcome);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.huntingWitch);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if no center creaturee', function () {
            this.player2.moveCard(this.dustPixie, 'discard');
            this.player1.play(this.universalWelcome);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
