describe('Ragnarok Prep', function () {
    describe("RagnarokP rep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'berserker',
                    amber: 2,
                    inPlay: ['armsmaster-molina'],
                    hand: ['red-alert', 'krump', 'brammo', 'ragnarok-prep']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'flaxia']
                }
            });
            this.player1.moveCard(this.redAlert, 'deck');
        });

        it('if less creatures, should make a token and not make opponent lose 2A', function () {
            this.player1.play(this.ragnarokPrep);
            this.player1.clickPrompt('Left');
            expect(this.redAlert.name).toBe('Berserker');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('if more creatures, should make a token and make opponent lose 2A', function () {
            this.player1.play(this.krump);
            this.player1.play(this.ragnarokPrep);
            this.player1.clickPrompt('Left');
            expect(this.redAlert.name).toBe('Berserker');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });

        it('if more creatures and empty deck, should not make a token and make opponent lose 2A', function () {
            this.player1.player.deck = [];
            this.player1.play(this.brammo);
            this.player1.play(this.ragnarokPrep);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });
});
