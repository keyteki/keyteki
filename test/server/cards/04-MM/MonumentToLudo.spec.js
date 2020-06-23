describe('Monument to Ludo', function () {
    describe("Monument to Ludo's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['monument-to-ludo', 'bad-penny', 'praefectus-ludo'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should prompt for a creature when activated', function () {
            this.player1.useAction(this.monumentToLudo);

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).not.toBeAbleToSelect(this.monumentToLudo);
        });

        it('should remove 1 amber from selected creature when ludo is not in discard', function () {
            this.badPenny.tokens.amber = 5;
            this.player1.useAction(this.monumentToLudo);
            this.player1.clickCard(this.badPenny);

            expect(this.badPenny.tokens.amber).toBe(4);
        });

        it('should remove 2 amber from selected creature when ludo is in discard', function () {
            this.badPenny.tokens.amber = 5;
            this.player1.player.moveCard(this.praefectusLudo, 'discard');
            this.player1.useAction(this.monumentToLudo);
            this.player1.clickCard(this.badPenny);

            expect(this.badPenny.tokens.amber).toBe(3);
        });
    });
});
