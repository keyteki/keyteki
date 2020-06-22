describe('Hapsis', function () {
    describe("Hapsis' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hapsis']
                },
                player2: {
                    inPlay: ['eyegor']
                }
            });
        });

        it('should draw a card when it attacks and destroys a creature', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(2);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.hapsis.hasToken('ward')).toBe(true);
        });

        it('should draw a card when it is attacked and the attacker is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            let handSize = this.player1.hand.length;
            this.player2.fightWith(this.eyegor, this.hapsis);
            expect(this.eyegor.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(2);
            expect(this.hapsis.hasToken('ward')).toBe(true);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });
    });
});
