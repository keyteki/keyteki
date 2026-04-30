describe('Keenu', function () {
    describe("Keenu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['keenu'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('exhausts an enemy creature with no +1 power counters and its neighbors', function () {
            this.player1.play(this.keenu);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.bumpsy);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target a creature with +1 power counters', function () {
            this.bumpsy.powerCounters = 1;
            this.player1.play(this.keenu);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
