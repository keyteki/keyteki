describe('Loyal Packmate', function () {
    describe("Cauldron's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['troll', 'sneklifter', 'hapless-cadet', 'groke']
                },
                player2: {
                    inPlay: ['umbra', 'witch-of-the-eye', 'loyal-packmate', 'champion-anaphiel']
                }
            });
        });

        it('prevents attacks to non-taunt creatures', function () {
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.loyalPackmate);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            this.player1.clickCard(this.loyalPackmate);
            this.player1.fightWith(this.groke, this.umbra);
        });

        it('does not affect fights against enemy creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.umbra, this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
