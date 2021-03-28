describe('Heart of the Forest', function () {
    describe("Heart of the Forest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    inPlay: ['heart-of-the-forest']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });
        it('should stop a key being forged', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(6);
        });
    });

    describe("Heart of the Forest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    inPlay: ['heart-of-the-forest']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });

        it('should NOT stop a key being forged if the keys are equal', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(0);
        });
    });
});
