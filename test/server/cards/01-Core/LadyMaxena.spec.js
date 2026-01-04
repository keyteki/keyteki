describe('Lady Maxena', function () {
    describe("Lady Maxena's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['lady-maxena'],
                    inPlay: ['champion-anaphiel']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should stun a creature on play', function () {
            this.player1.playCreature(this.ladyMaxena);
            expect(this.player1).toHavePrompt('Lady Maxena');
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return to hand on action', function () {
            this.player1.playCreature(this.ladyMaxena);
            this.player1.clickCard(this.krump);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.useAction(this.ladyMaxena);
            expect(this.ladyMaxena.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
