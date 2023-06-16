describe('Ironyx Rebel', function () {
    describe("Ironyx Rebel's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'rebel',
                    inPlay: ['yxl-the-iron-captain', 'collector-worm', 'chelonia', 'flaxia'],
                    hand: ['ironyx-rebel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['alaka'],
                    hand: ['berserker-slam']
                }
            });
        });

        it('should ready both neighbors', function () {
            this.player1.reap(this.yxlTheIronCaptain);
            this.player1.reap(this.collectorWorm);
            this.player1.play(this.ironyxRebel, true, true);
            this.player1.clickCard(this.collectorWorm);
            expect(this.yxlTheIronCaptain.exhausted).toBe(false);
            expect(this.collectorWorm.exhausted).toBe(false);
            this.player1.endTurn();
        });

        it('should not ready non-mars neighbors', function () {
            this.chelonia.exhausted = true;
            this.flaxia.exhausted = true;
            this.player1.playCreature(this.ironyxRebel, true, true);
            this.player1.clickCard(this.flaxia);
            expect(this.chelonia.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(true);
        });
    });
});
