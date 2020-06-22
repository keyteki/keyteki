describe('Pride', function () {
    describe("Pride's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['brabble'],
                    amber: 1
                },
                player2: {
                    inPlay: ['troll'],
                    amber: 5
                }
            });
        });

        it("opponent should lose 1A when Brabble is destroyed during controller's turn", function () {
            this.player1.fightWith(this.brabble, this.troll);
            expect(this.brabble.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('opponent should lose 3A when Brabble is destroyed during their turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.brabble);
            expect(this.brabble.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
