describe("Hard Simpson Evil Twin's ability", function () {
    describe('when tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    inPlay: ['hard-simpson-evil-twin', 'shooler']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens', 'lamindra']
                }
            });
            this.shooler.tokens.damage = 1;
            this.murkens.tokens.damage = 1;
        });

        it('should not capture amber', function () {
            this.player1.reap(this.hardSimpsonEvilTwin);
            this.expectReadyToTakeAction(this.player1);
        });

        describe('when tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not capture amber', function () {
                this.player1.reap(this.hardSimpsonEvilTwin);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should capture amber on enemy creature', function () {
                this.player1.reap(this.hardSimpsonEvilTwin);
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.murkens);
                this.player1.clickCard(this.murkens);
                expect(this.murkens.amber).toBe(1);
                expect(this.lamindra.amber).toBe(0);
                expect(this.player1.amber).toBe(5);
                expect(this.player2.amber).toBe(2);
                this.expectReadyToTakeAction(this.player1);
            });

            it('should capture amber on friendly creature', function () {
                this.player1.reap(this.hardSimpsonEvilTwin);
                expect(this.player1).not.toBeAbleToSelect(this.hardSimpsonEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.shooler);
                this.player1.clickCard(this.shooler);
                expect(this.hardSimpsonEvilTwin.amber).toBe(0);
                expect(this.shooler.amber).toBe(1);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
                this.expectReadyToTakeAction(this.player1);
            });
        });
    });
});
