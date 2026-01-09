describe('Lupo the Scarred', function () {
    describe("Lupo the Scarred's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['lupo-the-scarred'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal 2 damage to an enemy creature on play', function () {
            this.player1.playCreature(this.lupoTheScarred);
            expect(this.player1).toHavePrompt('Lupo the Scarred');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.lupoTheScarred);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
