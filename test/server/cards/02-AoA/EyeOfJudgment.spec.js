describe('Eye of Judgment', function () {
    describe("Eye of Judgment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['eye-of-judgment'],
                    discard: ['tunk']
                },
                player2: {
                    discard: ['batdrone']
                }
            });
        });

        it('should purge a creature from a discard pile on action', function () {
            this.player1.useAction(this.eyeOfJudgment);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
