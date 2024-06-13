describe('Dimension Door', function () {
    describe("Dimension Door's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'doc-bookton'],
                    hand: ['dimension-door']
                },
                player2: {
                    amber: 3,
                    inPlay: []
                }
            });
            this.player1.play(this.dimensionDoor);
        });

        it('should steal amber when reaping', function () {
            this.player1.reap(this.dextre);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.hand.length).toBe(0);
            this.player1.reap(this.docBookton);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.hand.length).toBe(1);
        });

        it('should not gain amber when there is none to steal', function () {
            this.player2.amber = 1;
            this.player1.reap(this.dextre);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.hand.length).toBe(0);
            this.player1.reap(this.docBookton);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.hand.length).toBe(1);
        });
    });
});
