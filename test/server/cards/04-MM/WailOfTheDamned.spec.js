describe('Wail of the Damned', function () {
    describe("Wail of the Damned's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ember-imp', 'shooler', 'gub', 'mab-the-mad'],
                    hand: ['wail-of-the-damned']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'lamindra']
                }
            });

            // Add some enhancements
            this.gub.cardData.enhancements = ['amber', 'draw'];
            this.troll.cardData.enhancements = ['amber', 'amber'];
        });

        it('should destroy a creature with no bonus icon', function () {
            this.player1.play(this.wailOfTheDamned);

            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.mabTheMad);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);

            expect(this.shooler.location).toBe('discard');
        });
    });
});
