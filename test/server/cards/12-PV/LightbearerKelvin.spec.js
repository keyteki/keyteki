describe('Lightbearer Kelvin', function () {
    describe("Lightbearer Kelvin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['lightbearer-kelvin'],
                    discard: ['dust-pixie', 'lost-in-the-woods']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin'],
                    discard: ['ember-imp', 'nerve-blast']
                }
            });
        });

        it('should discard bottom card of own deck and put creature into play', function () {
            this.player1.moveCard(this.dustPixie, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt('My Deck');
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie.controller).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard bottom card of opponent deck and put creature into play', function () {
            this.player2.moveCard(this.emberImp, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt("Opponent's deck");
            expect(this.emberImp.location).toBe('discard');
            this.player1.clickPrompt('Right');
            expect(this.emberImp.location).toBe('play area');
            expect(this.emberImp.controller).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard bottom card of own deck and not put non-creature into play', function () {
            this.player1.moveCard(this.lostInTheWoods, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt('My Deck');
            expect(this.lostInTheWoods.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
