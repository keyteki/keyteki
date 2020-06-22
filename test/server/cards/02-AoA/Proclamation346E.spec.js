describe('Proclamation 346E', function () {
    describe("Proclamation 346E's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams', 'proclamation-346e']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });

        it('should stop a key being forged', function () {
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(6);
        });
    });

    describe("Proclamation 346E's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams', 'proclamation-346e']
                },
                player2: {
                    amber: 6,
                    hand: ['faygin'],
                    inPlay: ['murmook', 'urchin', 'bulwark']
                }
            });
        });

        it("shouldn't stop a key being forged if the opponent has the required creatures", function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(0);
        });
    });

    describe("Proclamation 346E's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams', 'proclamation-346e']
                },
                player2: {
                    amber: 6,
                    hand: ['faygin'],
                    inPlay: ['murmook', 'skeleton-key', 'bulwark']
                }
            });
        });

        it("shouldn't care about cards that are not creatures", function () {
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(6);
        });
    });
});
