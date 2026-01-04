describe('Ghostly Hand', function () {
    describe("Ghostly Hand's ability with exactly 1 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ghostly-hand']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should steal 1 amber when opponent has exactly 1', function () {
            this.player1.play(this.ghostlyHand);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ghostly Hand's ability with no amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ghostly-hand']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('should not steal amber when opponent has 0', function () {
            this.player1.play(this.ghostlyHand);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ghostly Hand's ability with more than 1 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ghostly-hand']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should not steal amber when opponent has more than 1', function () {
            this.player1.play(this.ghostlyHand);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
