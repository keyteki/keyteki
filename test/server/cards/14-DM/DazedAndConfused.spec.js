describe('Dazed and Confused', function () {
    describe("Dazed and Confused's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dazed-and-confused']
                },
                player2: {
                    inPlay: ['troll', 'urchin', 'bumpsy', 'krump']
                }
            });
        });

        it('exhausts a creature and its neighbors, then stuns up to 2 exhausted creatures', function () {
            this.player1.play(this.dazedAndConfused);
            this.player1.clickCard(this.urchin);
            expect(this.troll.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.troll.stunned).toBe(true);
            expect(this.urchin.stunned).toBe(false);
            expect(this.bumpsy.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('exhausts a flank creature and only one neighbor', function () {
            this.player1.play(this.dazedAndConfused);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.troll.stunned).toBe(true);
            expect(this.urchin.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
