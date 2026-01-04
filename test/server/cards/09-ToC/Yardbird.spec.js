describe('Yardbird', function () {
    describe("Yardbird's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'yardbird',
                    inPlay: ['yardbird:toad', 'yardbird:toad', 'yardbird:toad', 'umbra']
                },
                player2: {
                    amber: 3,
                    token: 'yardbird',
                    inPlay: ['troll', 'yardbird:toad']
                }
            });

            this.yardbird1 = this.player1.player.creaturesInPlay[0];
            this.yardbird2 = this.player1.player.creaturesInPlay[1];
            this.yardbird3 = this.player1.player.creaturesInPlay[2];
            this.yardbird4 = this.player2.player.creaturesInPlay[1];
        });

        it('should ready another Yardbird before fight', function () {
            this.player1.reap(this.yardbird1);
            this.player1.fightWith(this.yardbird2, this.troll);
            expect(this.player1).toBeAbleToSelect(this.yardbird1);
            expect(this.player1).toBeAbleToSelect(this.yardbird3);
            expect(this.player1).not.toBeAbleToSelect(this.yardbird2);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.yardbird4);
            this.player1.clickCard(this.yardbird1);
            expect(this.yardbird2.location).toBe('discard');
            this.player1.reap(this.yardbird);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
