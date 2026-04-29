describe('Kindrith Longshot', function () {
    describe("Kindrith Longshot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['kindrith-longshot']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal 2 damage to a creature on reap', function () {
            this.player1.reap(this.kindrithLongshot);
            expect(this.player1).toHavePrompt('Kindrith Longshot');
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
