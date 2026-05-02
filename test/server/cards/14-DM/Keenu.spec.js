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
                    inPlay: ['troll', 'bumpsy', 'krump', 'snufflegator']
                }
            });
        });

        it('exhausts an enemy creature with no +1 power counters and its neighbors', function () {
            this.player1.play(this.keenu);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.krump);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.snufflegator.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target a creature with +1 power counters and leaves its counters intact', function () {
            this.bumpsy.powerCounters = 1;
            this.player1.play(this.keenu);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.bumpsy.powerCounters).toBe(1);
            expect(this.krump.exhausted).toBe(false);
            expect(this.snufflegator.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
