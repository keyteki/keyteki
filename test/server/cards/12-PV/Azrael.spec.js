describe('Azrael', function () {
    describe("Azrael's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    inPlay: ['azrael', 'ember-imp', 'troll']
                },
                player2: {
                    inPlay: ['ancient-bear', 'dust-pixie']
                }
            });
        });

        it('should allow friendly creatures to fight after reaping', function () {
            this.player1.reap(this.azrael);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Ember Imp');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.tokens.damage).toBe(2);
            this.player1.fightWith(this.troll, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
