describe('Nightforge', function () {
    describe("Nightforge's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nightforge'],
                    amber: 10
                },
                player2: {}
            });
        });

        it('forges a key at +4A current cost when no key has been forged this turn', function () {
            this.player1.play(this.nightforge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            const keys = this.player1.player.keys;
            expect(keys.red).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not forge when the player declines', function () {
            this.player1.play(this.nightforge);
            this.player1.clickPrompt('No');
            const keys = this.player1.player.keys;
            expect(keys.red).toBe(false);
            expect(keys.blue).toBe(false);
            expect(keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(11);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Nightforge after a key has already been forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nightforge'],
                    amber: 10
                },
                player2: {}
            });
        });

        it('does not offer to forge when the player has already forged this turn', function () {
            this.player1.player.keysForgedThisRound.push('red');
            this.player1.play(this.nightforge);
            expect(this.player1).not.toHavePromptButton('Yes');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
