describe('Empathic Malice', function () {
    describe("Empathic Malice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['empathic-malice', 'a-strong-feeling'],
                    inPlay: ['charette', 'sinder'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia']
                }
            });
        });

        it('makes a friendly creature capture 3', function () {
            this.player1.play(this.empathicMalice);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.sinder);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('goes to discard if not haunted', function () {
            this.player1.play(this.empathicMalice);
            this.player1.clickCard(this.charette);
            expect(this.empathicMalice.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('goes to bottom of deck if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.empathicMalice);
            this.player1.clickCard(this.charette);
            expect(this.empathicMalice.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.empathicMalice
            );
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
