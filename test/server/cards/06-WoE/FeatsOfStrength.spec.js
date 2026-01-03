describe('Feats of Strength', function () {
    describe("Feats of Strength's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'warrior',
                    inPlay: ['bumpsy'],
                    hand: ['feats-of-strength', 'feats-of-strength', 'punch']
                },
                player2: {
                    inPlay: ['batdrone', 'ganymede-archivist']
                }
            });

            this.featsOfStrength2 = this.player1.player.hand[1];
        });

        it('should make a token for enemy creature killed in a fight this turn', function () {
            this.player1.play(this.featsOfStrength);
            this.player1.fightWith(this.bumpsy, this.ganymedeArchivist);
            this.player1.clickPrompt('Right');
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            this.player1.play(this.punch);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stack', function () {
            this.player1.play(this.featsOfStrength);
            this.player1.play(this.featsOfStrength2);
            this.player1.fightWith(this.bumpsy, this.ganymedeArchivist);
            this.player1.clickPrompt('Autoresolve');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });
    });
});
