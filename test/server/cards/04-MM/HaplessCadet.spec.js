describe('Hapless Cadet', function () {
    describe("Hapless Cadet's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['hapless-cadet'],
                    amber: 3
                },
                player2: {
                    amber: 7,
                    inPlay: ['troll']
                }
            });
        });

        it('opponent should lose 3A when destroyed', function () {
            this.player1.fightWith(this.haplessCadet, this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.haplessCadet.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
        });
    });
});
