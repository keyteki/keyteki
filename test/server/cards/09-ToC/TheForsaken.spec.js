describe('The Forsaken', function () {
    describe("The Forsaken's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['the-forsaken', 'tocsin'],
                    hand: ['gub'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    hand: ['recklessness', 'troll', 'krump', 'pelf']
                }
            });

            this.toad1 = this.player1.deck[0];
            this.toad2 = this.player1.deck[1];
            this.toad3 = this.player1.deck[2];

            this.player1.chains = 36;
        });

        it('should cause a token to be made on the left when we make opponent discard a card', function () {
            this.player1.reap(this.tocsin);
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not cause a token to be made on the left when we discard a card', function () {
            this.player1.scrap(this.gub);
            expect(this.toad1.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause a token to be made on the left when opponent discards a card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.scrap(this.troll);
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause a token to be made on the left when opponent discards multiple card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.recklessness);
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            expect(this.toad3.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad3);
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.toad2);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.toad1);
            expect(this.player1.player.creaturesInPlay.length).toBe(5);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
