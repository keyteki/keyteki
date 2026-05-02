describe('Vanguard Wounds', function () {
    describe("Vanguard Wounds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['vanguard-wounds'],
                    deck: ['caspart', 'noxious-ionox', 'sparkscheme']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('deals 3 and draws a card if creature destroyed', function () {
            const handBefore = this.player1.hand.length;
            this.player1.play(this.vanguardWounds);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handBefore - 1 + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3 but does not draw if creature survives', function () {
            const handBefore = this.player1.hand.length;
            this.player1.play(this.vanguardWounds);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
