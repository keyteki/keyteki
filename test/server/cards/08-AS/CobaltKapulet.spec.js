describe('Cobalt Kapulet', function () {
    describe("Cobalt Kapulet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['chuff-ape', 'zorg'],
                    inPlay: ['cobalt-kapulet']
                },
                player2: {
                    amber: 6,
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should capture 0 for no mars neighbors', function () {
            this.player1.reap(this.cobaltKapulet);
            expect(this.player2.amber).toBe(6);
        });

        it('should capture 2 for 1 mars neighbor', function () {
            this.player1.play(this.zorg);
            this.player1.reap(this.cobaltKapulet);
            expect(this.player2.amber).toBe(4);
        });

        it('should capture 4 for 2 mars neighbors', function () {
            this.player1.reap(this.cobaltKapulet);
            expect(this.player2.amber).toBe(6);
        });
    });
});
