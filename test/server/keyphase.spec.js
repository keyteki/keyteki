describe('key phase', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                hand: [
                    'titan-mechanic',
                    'hunting-witch',
                    'way-of-the-bear',
                    'protectrix',
                    'inka-the-spider',
                    'nepenthe-seed'
                ],
                discard: ['ancient-bear']
            },
            player2: {
                amber: 9,
                inPlay: ['batdrone']
            }
        });
    });

    it('should forge a key at normal cost', function () {
        this.player1.clickPrompt('logos');
        this.player1.endTurn();
        this.player2.forgeKey('Red');
        expect(this.player2.player.keys.red).toBe(true);
        expect(this.player2.player.keys.blue).toBe(false);
        expect(this.player2.player.keys.yellow).toBe(false);
        expect(this.player2.amber).toBe(3);
    });

    it('should apply cost modifiers', function () {
        this.player1.clickPrompt('logos');
        this.titanMechanic = this.player1.clickCard('titan-mechanic');
        this.player1.clickPrompt('Play this creature');
        expect(this.titanMechanic.location).toBe('play area');
        this.player1.endTurn();
        this.player2.forgeKey('Red');
        expect(this.player2.player.keys.red).toBe(true);
        expect(this.player2.player.keys.blue).toBe(false);
        expect(this.player2.player.keys.yellow).toBe(false);
        expect(this.player2.amber).toBe(4);
    });
});
