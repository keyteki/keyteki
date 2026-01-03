describe('Unsettling Ancestry', function () {
    describe("Unsettling Ancestry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['unsettling-ancestry', 'crushing-deep'],
                    inPlay: ['bubbles'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['umbra', 'hunting-witch']
                }
            });
        });

        it('stuns and exhausts, but does not archive if not haunted', function () {
            this.player1.play(this.unsettlingAncestry);
            expect(this.player1).not.toBeAbleToSelect(this.bubbles);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.umbra);
            this.expectReadyToTakeAction(this.player1);
            expect(this.umbra.stunned).toBe(true);
            expect(this.umbra.exhausted).toBe(true);
            expect(this.unsettlingAncestry.location).toBe('discard');
        });

        it('stuns and exhausts, and archives if haunted', function () {
            this.player1.play(this.crushingDeep);
            this.player1.play(this.unsettlingAncestry);
            this.player1.clickCard(this.umbra);
            this.expectReadyToTakeAction(this.player1);
            expect(this.umbra.stunned).toBe(true);
            expect(this.umbra.exhausted).toBe(true);
            expect(this.unsettlingAncestry.location).toBe('archives');
        });
    });
});
