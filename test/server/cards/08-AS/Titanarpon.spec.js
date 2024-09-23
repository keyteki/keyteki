describe('Titanarpon', function () {
    describe("Titanarpon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['titanarpon'],
                    hand: ['dust-imp', 'gub']
                },
                player2: {
                    amber: 3,
                    hand: ['troll']
                }
            });
        });

        it('should allow first creature played to come in ready', function () {
            this.player1.playCreature(this.dustImp);
            expect(this.dustImp.exhausted).toBe(false);
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
