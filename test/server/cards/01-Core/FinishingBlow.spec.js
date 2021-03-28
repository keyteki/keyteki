describe('Finishing Blow', function () {
    describe("Finishing Blow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['finishing-blow'],
                    inPlay: ['silvertooth']
                },
                player2: {
                    amber: 2,
                    inPlay: ['yantzee-gang']
                }
            });
        });

        it('should steal an amber when killing a damaged creature', function () {
            this.player1.fightWith(this.silvertooth, this.yantzeeGang);
            this.player1.play(this.finishingBlow);
            expect(this.player1).toHavePrompt('Finishing Blow');
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            this.player1.clickCard(this.yantzeeGang);
            expect(this.yantzeeGang.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal when there are no damaged creates', function () {
            this.player1.play(this.finishingBlow);
            expect(this.yantzeeGang.location).toBe('play area');
            expect(this.silvertooth.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
