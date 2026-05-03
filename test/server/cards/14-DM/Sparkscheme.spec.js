describe('Sparkscheme', function () {
    describe("Sparkscheme's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['sparkscheme']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('draws a card after enemy reaps if exhausted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.sparkscheme.exhaust();
            const before = this.player1.hand.length;
            this.player2.reap(this.troll);
            // Two reactions trigger (Sparkscheme + Troll); pick Sparkscheme first
            this.player2.clickCard(this.sparkscheme);
            expect(this.player1.hand.length).toBe(before + 1);
        });

        it('does nothing if not exhausted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            const before = this.player1.hand.length;
            this.player2.reap(this.troll);
            expect(this.player1.hand.length).toBe(before);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
