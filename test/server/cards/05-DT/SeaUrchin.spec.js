describe('Sea Urchin', function () {
    describe("Sea Urchin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['sea-urchin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should capture 1A when tide is neutral', function () {
            this.player1.play(this.seaUrchin);
            expect(this.seaUrchin.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('should capture 1A when tide is low', function () {
            this.player2.changeTide('high');
            this.player1.play(this.seaUrchin);
            expect(this.seaUrchin.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 1A when tide is high', function () {
            this.player1.raiseTide();
            expect(this.player1.tide).toBe('high');
            this.player1.play(this.seaUrchin);
            expect(this.seaUrchin.amber).toBe(0);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
