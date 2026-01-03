describe('Invasion Portal', function () {
    describe("Invasion Portal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['invasion-portal', 'troll', 'krump', 'ember-imp', 'zorg', 'dust-imp'],
                    deck: []
                },
                player2: {}
            });
        });

        it('should discard until finding a Mars creature and put it in hand', function () {
            this.player1.moveCard(this.dustImp, 'deck');
            this.player1.moveCard(this.zorg, 'deck');
            this.player1.moveCard(this.emberImp, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');

            this.player1.useAction(this.invasionPortal);
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.zorg.location).toBe('hand');
            expect(this.dustImp.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard entire deck if no Mars creature found', function () {
            this.player1.moveCard(this.dustImp, 'deck');
            this.player1.moveCard(this.emberImp, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');

            this.player1.useAction(this.invasionPortal);
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.zorg.location).toBe('play area');
            expect(this.dustImp.location).toBe('discard');
            expect(this.player1.deck.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
