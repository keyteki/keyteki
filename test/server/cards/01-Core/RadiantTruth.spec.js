describe('Radiant Truth', function () {
    describe("Radiant Truth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['radiant-truth'],
                    inPlay: ['commander-remiel', 'sergeant-zakiel', 'protectrix']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll', 'ganger-chieftain']
                }
            });
        });

        it('should stun each enemy creature not on a flank', function () {
            this.player1.play(this.radiantTruth);
            expect(this.commanderRemiel.stunned).toBe(false);
            expect(this.sergeantZakiel.stunned).toBe(false);
            expect(this.protectrix.stunned).toBe(false);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.troll.stunned).toBe(true);
            expect(this.gangerChieftain.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not stun any creatures if all are on flanks', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.play(this.radiantTruth);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.gangerChieftain.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
