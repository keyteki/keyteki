describe('Defend the Keyraken!', function () {
    describe("Defend the Keyraken!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['defend-the-keyraken'],
                    inPlay: ['legendary-keyraken', 'crushing-tentacle', 'troll', 'krump']
                },
                player2: {}
            });
        });

        it('wards a friendly keyraken creature and its neighbors', function () {
            this.player1.play(this.defendTheKeyraken);
            expect(this.player1).toHavePrompt('Defend the Keyraken!');
            expect(this.player1).toBeAbleToSelect(this.legendaryKeyraken);
            expect(this.player1).toBeAbleToSelect(this.crushingTentacle);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.crushingTentacle);
            expect(this.legendaryKeyraken.warded).toBe(true);
            expect(this.crushingTentacle.warded).toBe(true);
            expect(this.troll.warded).toBe(true);
            expect(this.krump.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
