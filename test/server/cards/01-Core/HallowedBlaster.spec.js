describe('Hallowed Blaster', function () {
    describe("Hallowed Blaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['hallowed-blaster', 'troll']
                },
                player2: {}
            });
            this.troll.damage = 5;
        });

        it('should heal 3 damage from a creature', function () {
            this.player1.useAction(this.hallowedBlaster);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
