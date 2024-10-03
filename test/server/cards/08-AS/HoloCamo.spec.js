describe('Holo Camo', function () {
    describe("Holo Camo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['holo-camo', 'twin-bolt-emission'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should keep a ready creature from being damaged', function () {
            this.player1.playUpgrade(this.holoCamo, this.helperBot);
            this.player1.play(this.twinBoltEmission);
            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.helperBot.tokens.damage).toBe(undefined);
            expect(this.helperBot.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not affect an exhausted creature', function () {
            this.player1.playUpgrade(this.holoCamo, this.helperBot);
            this.player1.fightWith(this.helperBot, this.troll);
            expect(this.helperBot.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
