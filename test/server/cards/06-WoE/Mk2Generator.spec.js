describe('Mk.2 Generator', function () {
    describe("Mk.2 Generator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'rebel',
                    inPlay: ['ether-spider'],
                    hand: ['mk2-generator']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.versusCard = this.player1.deck[0];
            this.player1.play(this.mk2Generator);
        });

        it('should enter play ready', function () {
            expect(this.mk2Generator.exhausted).toBe(false);
            this.player1.endTurn();
        });

        it('should make a token creature', function () {
            this.player1.useAction(this.mk2Generator);
            this.player1.clickPrompt('Left');
            let rebel = this.player1.inPlay[0];
            expect(rebel.id).toBe('rebel');
            expect(rebel.versusCard).toBe(this.versusCard);
            expect(rebel.exhausted).toBe(true);
            this.player1.endTurn();
        });
    });
});
