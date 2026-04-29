describe('Emperor Memrox', function () {
    describe("Emperor Memrox's reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox'],
                    hand: ['urchin', 'troll']
                }
            });
        });

        it('archives a card on reap and gains 1 amber per archived card', function () {
            this.player1.reap(this.emperorMemrox);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            // 1 from reap + 1 from archive count (1 in archives)
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Emperor Memrox's reap with a card already archived", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox'],
                    archives: ['bumpsy'],
                    hand: ['urchin']
                }
            });
        });

        it('gains 1 reap + 2 amber for the two archived cards', function () {
            this.player1.reap(this.emperorMemrox);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            // 1 from reap + 2 from archive count (bumpsy + urchin)
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Emperor Memrox's reap with empty hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox'],
                    hand: []
                }
            });
        });

        it('gains only the reap amber when no cards are in hand to archive', function () {
            this.player1.reap(this.emperorMemrox);
            expect(this.player1.player.archives.length).toBe(0);
            // 1 from reap + 0 archived
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
