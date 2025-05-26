describe('Ox Sarbane', function () {
    describe("Ox Sarbane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['ox-sarbane', 'urchin', 'troll'],
                    amber: 0
                },
                player2: {
                    inPlay: ['krump', 'dust-pixie', 'shock-herder'],
                    amber: 3
                }
            });
        });

        it('should exhaust friendly creatures that share a house after fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.krump, this.urchin);
            expect(this.shockHerder.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(false);
            expect(this.dustPixie.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should exhaust friendly creatures that share a house after reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.troll.exhausted).toBe(false);
            expect(this.shockHerder.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
