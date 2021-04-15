describe('Sea Urchin Evil Twin', function () {
    describe("Sea Urchin Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['sea-urchin-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should capture 2A when tide is neutral', function () {
            this.player1.play(this.seaUrchinEvilTwin);
            expect(this.seaUrchinEvilTwin.amber).toBe(2);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });

        it('should capture 2A when tide is low', function () {
            this.player1.lowerTide();
            this.player1.play(this.seaUrchinEvilTwin);
            expect(this.seaUrchinEvilTwin.amber).toBe(2);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });

        it('should steal 2A when tide is high', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.play(this.seaUrchinEvilTwin);
            expect(this.seaUrchinEvilTwin.amber).toBe(0);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(2);
        });
    });
});
