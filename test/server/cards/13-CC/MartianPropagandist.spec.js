describe('Martian Propagandist', function () {
    describe("Martian Propagandist's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['troll', 'krump'],
                    hand: ['martian-propagandist', 'culf-the-quiet']
                },
                player2: {
                    inPlay: ['dust-pixie', 'flaxia']
                }
            });
        });

        it('should make neighbors belong to house Mars when played', function () {
            this.player1.playCreature(this.martianPropagandist);
            // Default placement is rightmost, so krump is the only neighbor
            expect(this.krump.hasHouse('mars')).toBe(true);
            expect(this.troll.hasHouse('mars')).toBe(false);
            expect(this.dustPixie.hasHouse('mars')).toBe(false);
            expect(this.flaxia.hasHouse('mars')).toBe(false);
            this.player1.reap(this.krump);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make neighbors belong to house Mars after reaping', function () {
            this.player1.playCreature(this.martianPropagandist);
            this.player1.moveCard(this.culfTheQuiet, 'play area');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.krump.hasHouse('mars')).toBe(false);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.reap(this.martianPropagandist);
            expect(this.krump.hasHouse('mars')).toBe(true);
            expect(this.culfTheQuiet.hasHouse('mars')).toBe(true);
            expect(this.troll.hasHouse('mars')).toBe(false);
            this.player1.reap(this.culfTheQuiet);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
