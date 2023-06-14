describe('Prospector', function () {
    describe('in play,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    token: 'prospector',
                    hand: ['trading-frenzy'],
                    inPlay: ['flaxia', 'the-old-tinker', 'prospector:chelonia'],
                    deck: ['the-visible-hand']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should cause card draw on death', function () {
            const initialCards = this.player1.hand.length;
            let prospector = this.player1.inPlay[2];

            this.player1.fightWith(prospector, this.krump);

            expect(this.player1.hand.length).toBe(initialCards + 1);
        });
    });
});
