// eslint-disable-next-line jasmine/no-focused-tests
fdescribe('Prospector', function () {
    describe('when entering play,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    token: 'prospector',
                    hand: ['hire-on', 'faust-the-great'],
                    inPlay: ['flaxia', 'the-old-tinker']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.moveCard(this.faustTheGreat, 'deck');
            this.player1.play(this.hireOn);
        });

        it('should show correct prompt title', function () {
            expect(this.player1).toHavePromptButton('Left');
            expect(this.player1).toHavePromptButton('Right');
        });
        /*
        it('should cause card draw when destroyed', function () {
        
            let prospector = this.player1.inPlay[2];

            this.player1.fightWith(prospector, this.krump);

            expect(this.player1.hand.length).toBe(initialCards + 1);
        });
        */
    });
});
