describe('Timoti the Dammed', function () {
    describe("Timoti the Dammed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'unfathomable',
                    token: 'priest',
                    hand: ['timoti-the-dammed']
                },
                player2: {
                    amber: 8,
                    token: 'grumpus',
                    inPlay: ['lupo-the-scarred', 'grumpus:pelf'],
                    hand: ['key-charge']
                }
            });
        });

        it('should stop opponent from forging', function () {
            this.player1.play(this.timotiTheDammed);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
        });

        it('should not stop self from forging', function () {
            this.player1.play(this.timotiTheDammed);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.keys.red).toBe(true);
        });

        it('should stop key cheats', function () {
            this.player1.play(this.timotiTheDammed);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.keyCharge);
            expect(this.player2.amber).toBe(7);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not stop forging once the tokens die', function () {
            this.player1.play(this.timotiTheDammed);
            this.player1.clickPrompt('Right');
            let priest = this.player1.player.creaturesInPlay[1];
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.lupoTheScarred, priest);
            this.player2.play(this.keyCharge);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(1);
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
