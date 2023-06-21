describe('General Ză Orhă', function () {
    describe("General Ză Orhă's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    token: 'grunt',
                    hand: ['general-ză-orhă']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('makes no token creatures after playing', function () {
            this.player1.play(this.generalZăOrhă);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes one token creature after playing', function () {
            this.player2.player.keys['blue'] = true;
            this.player1.play(this.generalZăOrhă);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes two token creatures after playing', function () {
            this.player2.player.keys['blue'] = true;
            this.player2.player.keys['red'] = true;
            this.player1.play(this.generalZăOrhă);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
