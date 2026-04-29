describe('Fallguy', function () {
    describe("Fallguy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['fallguy'],
                    amber: 0
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should steal 1 amber when destroyed', function () {
            this.player1.fightWith(this.fallguy, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.fallguy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
