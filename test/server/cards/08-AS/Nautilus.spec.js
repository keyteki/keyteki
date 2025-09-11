describe('Nautilus', function () {
    describe("Nautilus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['nautilus'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should ward a creature and draw a card on play', function () {
            this.player1.play(this.nautilus);
            expect(this.player1).toBeAbleToSelect(this.nautilus);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.warded).toBe(true);
            expect(this.nautilus.warded).toBe(false);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ward a creature and draw a card on fight', function () {
            this.player1.play(this.nautilus);
            this.player1.clickCard(this.helperBot);
            this.nautilus.exhausted = false;
            this.player1.fightWith(this.nautilus, this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.nautilus);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.nautilus);
            expect(this.helperBot.warded).toBe(true);
            expect(this.nautilus.warded).toBe(true);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
