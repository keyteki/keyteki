describe('Covetous Hema', function () {
    describe("Covetous Hema's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['flaxia'],
                    hand: ['covetous-hema', 'kaupe']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should gain elusive when not on a flank', function () {
            this.player1.play(this.covetousHema, true);
            expect(this.player2.amber).toBe(1);
            expect(this.covetousHema.amber).toBe(3);
            expect(this.covetousHema.getKeywordValue('elusive')).toBe(0);
            this.player1.play(this.kaupe, true);
            expect(this.covetousHema.getKeywordValue('elusive')).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.flaxia);
            expect(this.covetousHema.getKeywordValue('elusive')).toBe(0);
        });
    });
});
