describe('Rotfeast', function () {
    describe("Rotfeast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['rotfeast', 'the-common-cold'],
                    inPlay: ['dust-pixie', 'troll']
                },
                player2: {
                    inPlay: ['umbra', 'mindwarper']
                }
            });
        });

        it('gains amber from actions', function () {
            this.player1.play(this.rotfeast);
            this.player1.play(this.theCommonCold);
            this.player1.clickPrompt('Autoresolve');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(7);
        });

        it('gains amber from fights', function () {
            this.player1.play(this.rotfeast);
            this.player1.fightWith(this.dustPixie, this.umbra);
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(4);
        });
    });
});
