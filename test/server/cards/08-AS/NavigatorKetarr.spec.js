describe('Navigator Ketarr', function () {
    describe("Navigator Ketarr's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'skyborn',
                    hand: ['bosun-creen'],
                    inPlay: ['gub', 'navigator-ketarr']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should draw 2 cards and archive while on flank', function () {
            this.player1.reap(this.navigatorKetarr);
            expect(this.player1.player.hand.length).toBe(3);
            this.player1.clickCard(this.bosunCreen);
            expect(this.bosunCreen.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing while not on flank', function () {
            this.player1.playCreature(this.bosunCreen);
            this.player1.reap(this.navigatorKetarr);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
