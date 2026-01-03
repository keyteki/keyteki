describe('Phantasmal Visit', function () {
    describe("Phantasmal Visit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['phantasmal-visit', 'a-strong-feeling'],
                    inPlay: ['flaxia'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['charette', 'cpo-zytar'],
                    discard: ['medic-ingram']
                }
            });
        });

        it('exhausts and stuns a creature', function () {
            this.player1.play(this.phantasmalVisit);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.exhausted).toBe(true);
            expect(this.cpoZytar.stunned).toBe(true);
            expect(this.charette.exhausted).toBe(false);
            expect(this.charette.stunned).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not archive if not haunted', function () {
            this.player1.play(this.phantasmalVisit);
            this.player1.clickCard(this.cpoZytar);
            expect(this.phantasmalVisit.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does archive if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.phantasmalVisit);
            this.player1.clickCard(this.cpoZytar);
            expect(this.phantasmalVisit.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does archive if haunted with no creatures in play', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.charette, 'deck');
            this.player1.moveCard(this.cpoZytar, 'deck');
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.phantasmalVisit);
            expect(this.phantasmalVisit.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
