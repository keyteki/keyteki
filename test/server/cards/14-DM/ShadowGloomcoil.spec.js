describe('Shadow Gloomcoil', function () {
    describe("Shadow Gloomcoil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['shadow-gloomcoil', 'caspart']
                },
                player2: {}
            });
        });

        it('deals 1 to each friendly creature after a friendly creature is used', function () {
            this.player1.reap(this.caspart);
            expect(this.shadowGloomcoil.tokens.damage).toBe(1);
            expect(this.caspart.tokens.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
