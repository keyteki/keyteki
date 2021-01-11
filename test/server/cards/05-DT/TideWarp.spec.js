describe('Tide Warp', function () {
    describe("Tide Warp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['tide-warp']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should not raise any tide if tide is neutral', function () {
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player1.endTurn();
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();
        });

        it('should warp tides when in play and during your start of turn', function () {
            this.player1.play(this.tideWarp);
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player1.endTurn();
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.tide).toBe('high');
            expect(this.player2.tide).toBe('low');
            expect(this.player1.chains).toBe(0);

            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player1.tide).toBe('high');
            expect(this.player2.tide).toBe('low');

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.tide).toBe('low');
            expect(this.player2.tide).toBe('high');
            expect(this.player2.chains).toBe(0);
        });

        it('should warp after opponent raises the tide', function () {
            this.player1.play(this.tideWarp);
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player1.endTurn();
            expect(this.player1.tide).toBeNull();
            expect(this.player2.tide).toBeNull();

            this.player2.clickPrompt('shadows');
            this.player2.raiseTide();
            expect(this.player1.tide).toBe('low');
            expect(this.player2.tide).toBe('high');
            expect(this.player2.chains).toBe(3);
            this.player2.endTurn();
            expect(this.player1.tide).toBe('high');
            expect(this.player2.tide).toBe('low');
            expect(this.player1.chains).toBe(0);
        });
    });
});
