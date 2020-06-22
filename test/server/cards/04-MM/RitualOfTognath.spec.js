describe('Ritual of Tognath', function () {
    describe("Ritual of Tognath's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ember-imp', 'shooler', 'gub', 'spyyyder'],
                    hand: ['ritual-of-tognath']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'lamindra']
                }
            });
        });
        it('should destroy 2 friendly creatures', function () {
            this.player1.play(this.ritualOfTognath);

            expect(this.player1).toBeAbleToSelect(this.spyyyder);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Done');

            expect(this.shooler.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
        });
    });
});
