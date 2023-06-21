describe('Endless Hordes', function () {
    describe("Endless Hordes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grunt',
                    hand: ['endless-hordes', 'anger']
                },
                player2: {
                    inPlay: ['bumpsy', 'dust-pixie'],
                    hand: ['champion-anaphiel']
                }
            });
        });

        it('should make the right number of tokens', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should ready and fight with each token against each enemy creature', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should ready and fight while ignoring taunt', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playCreature(this.championAnaphiel, false);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            // Ignoring taunt shouldn't persist.
            this.player1.play(this.anger);
            this.player1.clickCard(this.player1.player.creaturesInPlay[0]);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
        });
    });
});
