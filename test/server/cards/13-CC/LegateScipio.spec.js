describe('Legate Scipio', function () {
    describe("Legate Scipio's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['legate-scipio'],
                    inPlay: ['charette', 'gub', 'troll']
                },
                player2: {
                    inPlay: ['lamindra', 'tricerian-legionary']
                }
            });
        });

        it('should exalt all Saurian creatures when played', function () {
            this.player1.playCreature(this.legateScipio);
            this.player1.clickCard(this.legateScipio);
            expect(this.legateScipio.tokens.amber).toBe(1);
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.gub.tokens.amber).toBeUndefined();
            expect(this.troll.tokens.amber).toBeUndefined();
            expect(this.lamindra.tokens.amber).toBeUndefined();
            expect(this.tricerianLegionary.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be optional', function () {
            this.player1.play(this.legateScipio);
            this.player1.clickPrompt('Done');
            expect(this.legateScipio.tokens.amber).toBeUndefined();
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.gub.tokens.amber).toBeUndefined();
            expect(this.troll.tokens.amber).toBeUndefined();
            expect(this.lamindra.tokens.amber).toBeUndefined();
            expect(this.tricerianLegionary.tokens.amber).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
