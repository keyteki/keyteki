describe('Com Officer Palik', function () {
    describe("Com Officer Palik's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['com-officer-palik', 'batdrone']
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin']
                }
            });
        });

        it('capture 1 on self on reap', function () {
            this.player1.reap(this.comOfficerPalik);
            expect(this.player1).toBeAbleToSelect(this.comOfficerPalik);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.comOfficerPalik);
            this.expectReadyToTakeAction(this.player1);
            expect(this.comOfficerPalik.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('capture 1 on self on fight', function () {
            this.player1.fightWith(this.comOfficerPalik, this.urchin);
            this.player1.clickCard(this.comOfficerPalik);
            this.expectReadyToTakeAction(this.player1);
            expect(this.comOfficerPalik.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('capture 1 on another creature on reap', function () {
            this.player1.reap(this.comOfficerPalik);
            this.player1.clickCard(this.batdrone);
            this.expectReadyToTakeAction(this.player1);
            expect(this.batdrone.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('can work off-house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.reap(this.comOfficerPalik);
            this.player1.clickCard(this.comOfficerPalik);
            this.expectReadyToTakeAction(this.player1);
            expect(this.comOfficerPalik.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
