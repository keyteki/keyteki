describe('Grey Warden', function () {
    describe("Grey Warden's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['almsmaster', 'grey-warden', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin']
                }
            });
        });

        it('should ready a neighboring Sanctum creature after fight', function () {
            this.almsmaster.exhaust();
            this.emberImp.exhaust();
            this.player1.fightWith(this.greyWarden, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.almsmaster);
            expect(this.almsmaster.exhausted).toBe(false);
            expect(this.greyWarden.exhausted).toBe(true);
            expect(this.emberImp.exhausted).toBe(true);
        });

        it('should ready a neighboring Sanctum creature after fight', function () {
            this.almsmaster.exhaust();
            this.emberImp.exhaust();
            this.player1.reap(this.greyWarden);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.almsmaster);
            expect(this.almsmaster.exhausted).toBe(false);
            expect(this.greyWarden.exhausted).toBe(true);
            expect(this.emberImp.exhausted).toBe(true);
        });
    });
});
