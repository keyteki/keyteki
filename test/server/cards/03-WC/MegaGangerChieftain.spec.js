describe('Mega Ganger Chieftain', function () {
    describe("Mega Ganger Chieftain's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['mega-ganger-chieftain']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('readies and fights with a chosen friendly neighbor', function () {
            this.troll.exhaust();
            this.player1.play(this.megaGangerChieftain);
            // Mega Ganger Chieftain is placed on the right flank, neighbor = Troll
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.megaGangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            // Troll was readied, then fought; ends exhausted.
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be skipped', function () {
            this.player1.play(this.megaGangerChieftain);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
