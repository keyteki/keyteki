describe('Titan Outpost', function () {
    describe("Titan Outpost's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    token: 'alpha-gamma',
                    hand: ['dust-pixie', 'hunting-witch'],
                    inPlay: ['flaxia', 'helper-bot', 'titan-outpost'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
        });

        it('should put a creature on bottom of deck, make a token, and archive a card', function () {
            this.player1.useAction(this.titanOutpost);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing if a creature is not moved', function () {
            this.flaxia.ward();
            this.player1.useAction(this.titanOutpost);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('play area');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.alphaGamma1.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
