describe('Phobivore', function () {
    describe("Phobivore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['phobivore', 'auction-off'],
                    inPlay: ['gemcoat-vendor'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('should do nothing if player is not haunted', function () {
            this.player1.playUpgrade(this.phobivore, this.gemcoatVendor);
            this.player1.reap(this.gemcoatVendor);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prevent use if player is haunted', function () {
            this.player1.play(this.auctionOff);
            this.player1.playUpgrade(this.phobivore, this.gemcoatVendor);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
