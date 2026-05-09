describe('Bastionclaw', function () {
    describe("Bastionclaw's ability", function () {
        it('reduces key cost by 1 per opponent forged key', function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['bastionclaw']
                },
                player2: {
                    amber: 12
                }
            });
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Opponent forges their first key
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.getCurrentKeyCost()).toBe(5);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Opponent forges their second key
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            this.player1.endTurn();
            this.player2.forgeKey('Blue');
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getForgedKeys()).toBe(2);
            expect(this.player1.player.getCurrentKeyCost()).toBe(4);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it('does not reduce key cost for your own forged keys', function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 12,
                    inPlay: ['bastionclaw']
                },
                player2: {}
            });
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Player forges their first key
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('ouboros');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Player forges their second key
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Blue');
            this.player1.clickPrompt('ouboros');
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stacks when there are two Bastionclaws', function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['bastionclaw', 'bastionclaw']
                },
                player2: {
                    amber: 6
                }
            });
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Opponent forges their first key
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.getCurrentKeyCost()).toBe(4);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);

            // Opponent forges their second key
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            this.player2.player.amber = 6;
            this.player1.endTurn();
            this.player2.forgeKey('Blue');
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getForgedKeys()).toBe(2);
            expect(this.player1.player.getCurrentKeyCost()).toBe(2);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });
    });
});
