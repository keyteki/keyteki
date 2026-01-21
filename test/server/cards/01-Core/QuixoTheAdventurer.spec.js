describe('Quixo the Adventurer', function () {
    describe("Quixo the Adventurer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['quixo-the-adventurer']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should draw a card when fighting', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.quixoTheAdventurer, this.bumpsy);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should take no damage due to skirmish', function () {
            this.player1.fightWith(this.quixoTheAdventurer, this.bumpsy);
            expect(this.quixoTheAdventurer.tokens.damage).toBeUndefined();
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
