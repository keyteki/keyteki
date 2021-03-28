describe('Seeker of Truth', function () {
    describe("Seeker of Truth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['troll', 'seeker-of-truth', 'bulwark', 'groggins', 'flaxia']
                },
                player2: {
                    inPlay: ['batdrone', 'lamindra']
                }
            });
        });

        it('should allow fighting with an non-Sanctum ready creature', function () {
            this.troll.exhausted = true;
            this.player1.fightWith(this.seekerOfTruth, this.lamindra);
            this.player1.clickCard(this.seekerOfTruth);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.lamindra);
            expect(this.flaxia.exhausted).toBe(true);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.lamindra.location).toBe('discard');
        });

        it('should be an optional choice', function () {
            this.troll.exhausted = true;
            this.player1.fightWith(this.seekerOfTruth, this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
