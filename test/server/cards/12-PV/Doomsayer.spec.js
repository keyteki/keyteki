describe('Doomsayer', function () {
    describe("Doomsayer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    inPlay: ['doomsayer', 'ember-imp', 'yurk']
                },
                player2: {
                    inPlay: ['flaxia', 'searine']
                }
            });

            this.emberImp.tokens.amber = 2;
            this.yurk.tokens.amber = 1;
            this.flaxia.tokens.amber = 3;
            this.searine.tokens.amber = 1;
        });

        it('should move amber from friendly creatures to common supply and deal damage', function () {
            this.player1.reap(this.doomsayer);
            expect(this.player1).toBeAbleToSelect(this.doomsayer);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.amber).toBe(0);
            expect(this.yurk.amber).toBe(1);
            expect(this.flaxia.amber).toBe(3);
            expect(this.searine.amber).toBe(1);

            expect(this.player1).toBeAbleToSelect(this.doomsayer);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.flaxia);

            expect(this.player1).toBeAbleToSelect(this.doomsayer);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.searine);
            expect(this.flaxia.damage).toBe(2);
            expect(this.searine.damage).toBe(2);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
