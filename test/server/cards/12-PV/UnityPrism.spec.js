describe('Unity Prism', function () {
    describe("Unity Prism's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: [
                        'unity-prism',
                        'ember-imp',
                        'ancient-bear',
                        'poke',
                        'draining-touch',
                        'batdrone'
                    ]
                },
                player2: {}
            });
        });

        it('should allow playing cards from any house and limit to 4 cards', function () {
            this.player1.play(this.unityPrism);
            this.player1.playCreature(this.emberImp);
            this.player1.playCreature(this.ancientBear);
            this.player1.play(this.poke);

            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePromptButton('Discard this card');
            expect(this.player1).toHavePromptButton('Cancel');
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');

            this.player1.clickCard(this.drainingTouch);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain amber for each house in hand when scrapped', function () {
            this.player1.scrap(this.unityPrism);
            expect(this.player1.amber).toBe(4);
        });

        it('should gain amber for house enhancements in hand when scrapped', function () {
            this.poke.enhancements = ['shadows'];
            this.player1.scrap(this.unityPrism);
            expect(this.player1.amber).toBe(5);
        });
    });
});
