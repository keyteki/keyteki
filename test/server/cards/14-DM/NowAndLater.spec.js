describe('NowAndLater', function () {
    describe("Now and Later's ability", function () {
        it('returns a creature to hand and archives a card', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the effect when overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 7,
                    hand: ['now-and-later', 'mack-the-knife', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.troll.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.mackTheKnife.location).toBe('archives');
            expect(this.urchin.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
