describe('DapperChapeau', function () {
    describe("Dapper Chapeau's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['dapper-chapeau'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
            this.player1.playUpgrade(this.dapperChapeau, this.exeldonYash);
        });

        it('returns to hand if damage destroys the target', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('attaches to the damaged creature when it survives', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(4);
            expect(this.troll.upgrades).toContain(this.dapperChapeau);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stays in discard when it destroys its own host', function () {
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.location).toBe('discard');
            expect(this.dapperChapeau.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
