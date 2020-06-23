describe('The Sting', function () {
    describe("The Sting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 8,
                    hand: ['key-charge'],
                    inPlay: ['nexus']
                },
                player2: {
                    amber: 6,
                    inPlay: ['the-sting']
                }
            });
        });

        it('should skip the controllers key phase', function () {
            this.player1.endTurn();
            expect(this.player2.amber).toBe(6);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
        });

        it("should cause the controller to receive oppponent's forging amber", function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(12);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
        });

        it('should sacrifice when used', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.theSting);
            expect(this.player2).toHavePrompt('The Sting');
            this.player2.clickPrompt("Use this card's Action ability");
            expect(this.theSting.location).toBe('discard');
        });

        it('should sacrifice when used with Nexus', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player2.amber).toBe(12);
            this.player1.clickPrompt('shadows');
            expect(this.theSting.location).toBe('play area');
            this.player1.reap(this.nexus);
            this.player1.clickCard(this.theSting);
            expect(this.theSting.location).toBe('discard');
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(6);
        });
    });
});
