describe('Protect the Weak', function () {
    describe("Protect the Weak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['protect-the-weak'],
                    inPlay: ['bulwark', 'sequis', 'champion-anaphiel']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should give attached creature +1 armor and taunt', function () {
            this.player1.playUpgrade(this.protectTheWeak, this.sequis);
            expect(this.sequis.armor).toBe(3);
            expect(this.sequis.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent neighbors from being attacked', function () {
            this.player1.playUpgrade(this.protectTheWeak, this.sequis);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).not.toBeAbleToSelect(this.bulwark);
            expect(this.player2).toBeAbleToSelect(this.sequis);
            expect(this.player2).not.toBeAbleToSelect(this.championAnaphiel);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
