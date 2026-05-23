describe('Lyco-Fiend', function () {
    describe("Lyco-Fiend's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lyco-fiend']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('steals 1A when destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.lycoFiend);
            expect(this.lycoFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
