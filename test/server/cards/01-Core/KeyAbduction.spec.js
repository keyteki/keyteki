describe('Key Abduction', function () {
    describe("Key Abduction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: [
                        'key-abduction',
                        'phase-shift',
                        'virtuous-works',
                        'chuff-ape',
                        'dextre',
                        'batdrone'
                    ],
                    inPlay: ['sequis', 'mindwarper', 'blypyp']
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
            this.zorg.tokens.damage = 3;
        });

        it('should return creatures to hand and not prompt to forge when the player has insufficient amber', function () {
            this.player1.play(this.keyAbduction);
            expect(this.player1.amber).toBe(1);
            expect(this.sequis.location).toBe('play area');
            expect(this.mindwarper.location).toBe('hand');
            expect(this.blypyp.location).toBe('hand');
            expect(this.zorg.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt to forge a key if the player has enough amber', function () {
            this.player1.amber = 8;
            this.player1.play(this.keyAbduction);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt to forge a key even if no mars creatures are returned to hand', function () {
            this.player1.amber = 9;
            this.player1.fightWith(this.mindwarper, this.zorg);
            this.player1.fightWith(this.blypyp, this.zorg);
            expect(this.mindwarper.location).toBe('discard');
            expect(this.blypyp.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');
            this.player1.play(this.keyAbduction);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
