describe('NowAndLater', function () {
    describe("Now and Later's ability", function () {
        it('returns an enemy creature to hand and archives a card', function () {
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

        it('returns a friendly creature to hand and archives a card', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife'],
                    inPlay: ['urchin', 'bumpsy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives a card when there are no creatures in play', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife']
                },
                player2: {}
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('returns a creature when the player has no cards to archive', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when there are no creatures and no cards to archive', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later']
                },
                player2: {}
            });
            this.player1.play(this.nowAndLater);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not repeat when not overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife', 'urchin'],
                    inPlay: ['bumpsy']
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
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the effect when overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('hand');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the return but not the archive when overwhelmed and the player has no more cards to archive', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats the effect when returning a friendly creature causes overwhelm', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['now-and-later', 'mack-the-knife'],
                    inPlay: ['bumpsy', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
            this.player1.play(this.nowAndLater);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('hand');
            this.player1.clickCard(this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('archives');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
