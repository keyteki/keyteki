describe('Aurascope', function () {
    describe("Aurascope's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['dust-pixie', 'way-of-the-pixie', 'plow-sword', 'a-strong-feeling'],
                    inPlay: ['aurascope'],
                    discard: ['hunting-witch', 'the-circle-of-life']
                },
                player2: {
                    amber: 1,
                    hand: ['medic-ingram'],
                    discard: ['quixxle-stone', 'infurnace', 'mark-of-dis', 'shooler']
                }
            });
        });

        it('should discard a card from hand', function () {
            this.player1.useAction(this.aurascope);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.wayOfThePixie);
            expect(this.player1).toBeAbleToSelect(this.plowSword);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.wayOfThePixie);
            expect(this.wayOfThePixie.location).toBe('discard');
        });

        it('should purge a card from a discard with matching type', function () {
            this.player1.useAction(this.aurascope);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.infurnace);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.theCircleOfLife);
            expect(this.player1).not.toBeAbleToSelect(this.quixxleStone);
            expect(this.player1).not.toBeAbleToSelect(this.markOfDis);
            this.player1.clickCard(this.infurnace);
            expect(this.infurnace.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
