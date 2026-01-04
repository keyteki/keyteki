describe('Reaver', function () {
    describe("Reaver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['boiler', 'a-strong-feeling'],
                    inPlay: ['reaver', 'charette']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.charette.amber = 3;
        });

        it('on reap moves 1 amber to your pool and discards a card', function () {
            this.player1.reap(this.reaver);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.reaver);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(2);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toBeAbleToSelect(this.boiler);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.location).toBe('discard');
            expect(this.thingFromTheDeep.tokens.damage).toBe(1); // boiler scrap
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when there is no amber to move', function () {
            this.player1.reap(this.reaver);
            this.player1.clickCard(this.reaver);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
