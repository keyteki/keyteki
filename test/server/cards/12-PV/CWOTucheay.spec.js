describe('CWO Tucheay', function () {
    describe("CWO Tucheay's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['cwo-tucheay'],
                    inPlay: ['krump', 'ember-imp']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('should fully heal and use a friendly creature when played', function () {
            this.krump.tokens.damage = 2;
            this.player1.play(this.cwoTucheay);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fully heal and use a friendly creature when reaping', function () {
            this.player1.moveCard(this.cwoTucheay, 'play area');
            this.emberImp.tokens.damage = 1;
            this.player1.reap(this.cwoTucheay);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.emberImp);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.emberImp.tokens.damage).toBeUndefined();
            expect(this.emberImp.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
