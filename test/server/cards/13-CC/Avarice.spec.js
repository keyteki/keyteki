describe('Avarice', function () {
    describe("Avarice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 3,
                    hand: ['avarice'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 2,
                    inPlay: ['krump']
                }
            });
        });

        it('should capture 2 amber from its own side when played', function () {
            this.player1.playUpgrade(this.avarice, this.troll);
            expect(this.troll.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('should capture 2 amber from opponent side when played on enemy creature', function () {
            this.player1.playUpgrade(this.avarice, this.krump);
            expect(this.krump.amber).toBe(2);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });
    });
});
