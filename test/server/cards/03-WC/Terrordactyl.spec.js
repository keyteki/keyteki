describe('Terrordactyl', function () {
    describe("Terrordactyl's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['terrordactyl']
                },
                player2: {
                    inPlay: ['redlock', 'krump']
                }
            });
        });

        it('should enter play stunned', function () {
            this.player1.play(this.terrordactyl);
            expect(this.terrordactyl.stunned).toBe(true);
        });
    });

    describe("Terrordactyl's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['terrordactyl']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'groggins']
                }
            });
        });

        it('should deal only 4 damages when fighting and 4 damages to neighbors', function () {
            this.player1.fightWith(this.terrordactyl, this.krump);
            expect(this.terrordactyl.tokens.damage).toBe(6);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.groggins.tokens.damage).toBe(4);
        });
    });
});
