describe('Dark Harbinger', function () {
    describe("Dark Harbinger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['fogbank', 'flaxia', 'miasma'],
                    inPlay: ['dark-harbinger']
                }
            });
        });

        it('should ready the creature when an untamed action is played', function () {
            this.player1.reap(this.darkHarbinger);
            this.player1.play(this.fogbank);
            this.player1.clickCard(this.darkHarbinger);
            expect(this.darkHarbinger.exhausted).toBe(false);
        });

        it('should not ready the card when a non-action untamed card is played', function () {
            this.player1.reap(this.darkHarbinger);
            this.player1.play(this.flaxia);
            this.player1.clickCard(this.darkHarbinger);
            expect(this.darkHarbinger.exhausted).toBe(true);
        });
    });
});
