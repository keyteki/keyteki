describe('Vindication Outpost', function () {
    describe("Vindication Outpost's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    token: 'zealot',
                    inPlay: ['vindication-outpost', 'gub'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie']
                }
            });

            this.zealot1 = this.player1.player.deck[0];
        });

        it('should put a creature to bottom of deck, make a token creature, ready and fight with it', function () {
            this.player1.useAction(this.vindicationOutpost);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.gub);
            expect(this.gub.location).toBe('deck');
            expect(this.zealot1.location).toBe('play area');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
