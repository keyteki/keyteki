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
            expect(this.envy.tokens.ward).toBe(1);
            expect(this.pride.tokens.ward).toBe(1);
            expect(this.wrath.tokens.ward).toBe(1);
            expect(this.lamindra.tokens.ward).toBeUndefined();
            expect(this.gub.tokens.ward).toBeUndefined();
            expect(this.desire.tokens.ward).toBeUndefined();
        });
    });
});
