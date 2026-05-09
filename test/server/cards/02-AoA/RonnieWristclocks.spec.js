describe('Ronnie Wristclocks', function () {
    describe("Ronnie Wristclocks' play ability when opponent has less than 7 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ronnie-wristclocks']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('steals 1 amber when the opponent has fewer than 7 amber', function () {
            this.player1.play(this.ronnieWristclocks);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ronnie Wristclocks' play ability at the boundary", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ronnie-wristclocks']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('steals 2 amber when the opponent has exactly 7 amber', function () {
            this.player1.play(this.ronnieWristclocks);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ronnie Wristclocks' play ability when opponent has 0 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ronnie-wristclocks']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('steals nothing when the opponent has no amber', function () {
            this.player1.play(this.ronnieWristclocks);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
