describe('Desire', function () {
    describe("Desire's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['desire', 'envy', 'pride', 'wrath'],
                    amber: 9
                },
                player2: {
                    amber: 11
                }
            });
            this.player1.reap(this.desire);
            this.player1.forgeKey('Red');
        });

        it('should forge a ket at 6 (6 +4 -4 sins in play)', function () {
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(4);
        });

        describe('Increase Key Cost for Opponent', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.forgeKey('Red');
            });

            it('should forge a key costing 10amber', function () {
                expect(this.player2.player.keys.red).toBe(true);
                expect(this.player2.player.keys.blue).toBe(false);
                expect(this.player2.player.keys.yellow).toBe(false);
                expect(this.player2.amber).toBe(1);
            });
        });
    });
});
