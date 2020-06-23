describe('Envy', function () {
    describe("Envy's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['envy', 'pride', 'wrath', 'lamindra', 'gub']
                },
                player2: {
                    amber: 10,
                    inPlay: ['desire']
                }
            });
        });

        it("should capture all opponent's amber", function () {
            expect(this.envy.amber).toBe(0);
            this.player1.reap(this.envy);
            expect(this.envy.amber).toBe(10);
        });

        it('should not capture if less than 2 sin creatures', function () {
            this.player1.moveCard(this.pride, 'discard');
            this.player1.moveCard(this.wrath, 'discard');
            expect(this.envy.amber).toBe(0);
            this.player1.reap(this.envy);
            expect(this.envy.amber).toBe(0);
        });
    });
});
