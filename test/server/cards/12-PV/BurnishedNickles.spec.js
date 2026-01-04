describe('Burnished Nickles', function () {
    describe("Burnished Nickles's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['burnished-nickles', 'ember-imp', 'urchin']
                },
                player2: {
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should return another creature to hand when destroyed', function () {
            this.player1.fightWith(this.burnishedNickles, this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.burnishedNickles);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('hand');
            expect(this.burnishedNickles.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
