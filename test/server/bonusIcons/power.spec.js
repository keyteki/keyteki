describe('Bonus Icons', function () {
    describe('+1 power counter bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll'],
                    inPlay: ['krump', 'bumpsy']
                },
                player2: {
                    inPlay: ['lamindra', 'urchin']
                }
            });

            this.troll.enhancements = ['power'];
        });

        it('prompts to add a +1 power counter to a creature on either side when played', function () {
            this.player1.play(this.troll);
            expect(this.player1).toHavePrompt(
                'Choose a creature to add a +1 power counter to due to bonus icon'
            );
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target an enemy creature', function () {
            this.player1.play(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.tokens.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target the played creature itself', function () {
            this.player1.play(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
