describe('Pride', function () {
    describe("Pride's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['envy', 'pride', 'wrath', 'lamindra', 'gub']
                },
                player2: {
                    inPlay: ['desire']
                }
            });
        });

        it('should ward all sin creatures', function () {
            this.player1.reap(this.pride);
            expect(this.envy.warded).toBe(true);
            expect(this.pride.warded).toBe(true);
            expect(this.wrath.warded).toBe(true);
            expect(this.lamindra.warded).toBe(false);
            expect(this.gub.warded).toBe(false);
            expect(this.desire.warded).toBe(false);
        });
    });
});
