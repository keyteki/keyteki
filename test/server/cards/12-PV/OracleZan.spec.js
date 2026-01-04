describe('Oracle Zan', function () {
    describe("Oracle Zan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['oracle-zan', 'ember-imp', 'troll'],
                    hand: []
                },
                player2: {
                    inPlay: ['ancient-bear', 'fandangle']
                }
            });

            this.emberImp.tokens.amber = 2;
            this.troll.tokens.damage = 3;
            this.ancientBear.tokens.damage = 4;
            this.fandangle.tokens.damage = 2;
            this.fandangle.tokens.amber = 1;
        });

        it('should move amber from a friendly creature and heal damage', function () {
            this.player1.reap(this.oracleZan);
            expect(this.player1).toBeAbleToSelect(this.oracleZan);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.fandangle);

            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.tokens.amber).toBeUndefined();

            expect(this.player1).toBeAbleToSelect(this.oracleZan);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.fandangle);

            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(1);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.tokens.damage).toBe(2);

            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if there is no amber to move', function () {
            this.player1.reap(this.oracleZan);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
