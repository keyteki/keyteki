describe('AuthorizedRequisitions', function () {
    describe("Authorized Requisitions's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['authorized-requisitions'],
                    inPlay: ['exeldon-yash'],
                    deck: ['mack-the-knife', 'troll']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('captures 2 amber on a friendly creature and draws a card', function () {
            const handSizeBefore = this.player1.hand.length;
            this.player1.play(this.authorizedRequisitions);
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.hand.length).toBe(handSizeBefore);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still draws when opponent has no amber', function () {
            this.player2.amber = 0;
            const handSizeBefore = this.player1.hand.length;
            this.player1.play(this.authorizedRequisitions);
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.hand.length).toBe(handSizeBefore);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still draws when there are no friendly creatures to capture onto', function () {
            this.player1.moveCard(this.exeldonYash, 'discard');
            const handSizeBefore = this.player1.hand.length;
            this.player1.play(this.authorizedRequisitions);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.hand.length).toBe(handSizeBefore);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
