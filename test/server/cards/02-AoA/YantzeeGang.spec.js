describe('Yantzee Gang', function () {
    describe("Yantzee Gang's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['yantzee-gang']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('steals 1 amber on action', function () {
            this.player1.useAction(this.yantzeeGang);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Yantzee Gang when opponent has no amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['yantzee-gang']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('steals nothing when the opponent has no amber', function () {
            this.player1.useAction(this.yantzeeGang);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
