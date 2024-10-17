describe('Gabos Longarms', function () {
    describe("Gabos Longarms's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['gabos-longarms', 'ember-imp']
                },
                player2: {
                    inPlay: ['champion-anaphiel', 'ganymede-archivist']
                }
            });
        });

        it('should trigger when he attacks', function () {
            this.player1.fightWith(this.gabosLongarms, this.championAnaphiel);
            expect(this.player1).toHavePrompt('Gabos Longarms');
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.gabosLongarms);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.gabosLongarms.location).toBe('discard');
            expect(this.championAnaphiel.hasToken('damage')).toBe(false);
        });

        it('should not trigger when he is attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.championAnaphiel, this.gabosLongarms);
            expect(this.gabosLongarms.location).toBe('discard');
            expect(this.championAnaphiel.tokens.damage).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
