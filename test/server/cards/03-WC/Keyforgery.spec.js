describe('Keyforgery', function () {
    describe("Keyforgery's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['keyforgery'],
                    hand: ['lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra', 'lamindra']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not ask for Keyforgery house when not forging a key', function () {
            this.player1.endTurn();
            expect(this.player2).not.toHavePrompt('Keyforgery');
            expect(this.player2).toHavePrompt('House Choice');
        });

        it('should not ask for Keyforgery when owner of artifact if forging a key', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Brobnar');
            this.player2.endTurn();
            expect(this.player1).not.toHavePrompt('Keyforgery');
            expect(this.player1).toHavePrompt('House Choice');
        });

        it('should ask for Keyforgery house when forging a key', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
        });

        it('should not destroy artifact and forge a key if the selected house is from the revealed card', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
            this.player2.clickPrompt('shadows');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.keyforgery.location).toBe('play area');
        });

        it('should destroy artifact and skip forge key step if the selected house is not from the revealed card', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Keyforgery');
            this.player2.clickPrompt('dis');
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.amber).toBe(6);
            expect(this.keyforgery.location).toBe('discard');
        });
    });
});
