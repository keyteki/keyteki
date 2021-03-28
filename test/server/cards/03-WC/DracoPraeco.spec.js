describe('Draco Praeco', function () {
    describe("Draco Praeco's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['draco-praeco', 'lamindra', 'troll']
                },
                player2: {
                    inPlay: ['redlock', 'krump']
                }
            });
        });

        it('should be able to choose not to ward', function () {
            this.player1.reap(this.dracoPraeco);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.dracoPraeco.hasToken('amber')).toBe(false);
        });

        it('should be able to choose to ward and select a house', function () {
            this.player1.reap(this.dracoPraeco);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.dracoPraeco);
            this.player1.clickCard(this.dracoPraeco);
            expect(this.dracoPraeco.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a house');
            this.player1.clickPrompt('shadows');

            expect(this.dracoPraeco.hasToken('enrage')).toBe(false);
            expect(this.lamindra.hasToken('enrage')).toBe(true);
            expect(this.troll.hasToken('enrage')).toBe(false);
            expect(this.redlock.hasToken('enrage')).toBe(true);
            expect(this.krump.hasToken('enrage')).toBe(false);
        });
    });
});
