describe('Historian Li-Darkin', function () {
    describe("Historian Li-Darkin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['historian-li-darkin'],
                    discard: ['sandhopper', 'flaxia']
                },
                player2: {
                    amber: 1,
                    discard: ['stealth-mode', 'timetraveller']
                }
            });
        });

        it('returns top discard card to hand for each player', function () {
            this.player1.reap(this.historianLiDarkin);
            expect(this.sandhopper.location).toBe('hand');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.player.hand).toContain(this.sandhopper);
            expect(this.stealthMode.location).toBe('hand');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.player2.player.hand).toContain(this.stealthMode);
            this.expectReadyToTakeAction(this.player1);
        });

        it('works if a discard is empty', function () {
            this.player1.moveCard(this.sandhopper, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.reap(this.historianLiDarkin);
            expect(this.sandhopper.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.stealthMode.location).toBe('hand');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.player2.player.hand).toContain(this.stealthMode);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
