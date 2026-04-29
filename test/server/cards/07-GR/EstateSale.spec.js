describe('Estate Sale', function () {
    describe("Estate Sale's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['estate-sale'],
                    inPlay: ['ornate-talking-tray'],
                    discard: ['sandhopper', 'flaxia', 'full-moon', 'freelancer', 'the-old-tinker']
                },
                player2: {
                    amber: 1,
                    discard: ['stealth-mode', 'timetraveller']
                }
            });
        });

        it('can purge an action from discard and gain 2', function () {
            this.player1.play(this.estateSale);
            expect(this.player1).toBeAbleToSelect(this.sandhopper);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toBeAbleToSelect(this.freelancer);
            expect(this.player1).not.toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).not.toBeAbleToSelect(this.stealthMode);
            expect(this.player1).not.toBeAbleToSelect(this.timetraveller);
            this.player1.clickCard(this.fullMoon);
            expect(this.fullMoon.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can purge an upgrade from discard and gain 2', function () {
            this.player1.play(this.estateSale);
            this.player1.clickCard(this.freelancer);
            expect(this.freelancer.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can purge an artifact from discard and gain 2', function () {
            this.player1.play(this.estateSale);
            this.player1.clickCard(this.sandhopper);
            expect(this.sandhopper.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing with no non-creatures', function () {
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.freelancer, 'deck');
            this.player1.moveCard(this.sandhopper, 'deck');
            this.player1.play(this.estateSale);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
