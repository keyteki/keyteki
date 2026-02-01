describe('Furtive Investors', function () {
    describe("Furtive Investors' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['furtive-investors']
                },
                player2: {}
            });
        });

        it('should gain 0 amber when opponent has more amber and no keys', function () {
            this.player2.player.keys = { red: false, blue: false, yellow: false };
            this.player1.amber = 3;
            this.player2.amber = 5;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 0 amber when opponent has less amber', function () {
            this.player2.player.keys = { red: false, blue: false, yellow: false };
            this.player1.amber = 5;
            this.player2.amber = 3;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 1 amber when opponent has more amber and 1 key', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.amber = 3;
            this.player2.amber = 5;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 0 amber when opponent has less amber and 1 key', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.amber = 5;
            this.player2.amber = 3;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2 amber when opponent has more amber and 2 keys', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.amber = 3;
            this.player2.amber = 5;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 0 amber when opponent has less amber and 2 keys', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.amber = 5;
            this.player2.amber = 3;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 0 amber when bonus amber makes amber equal', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.amber = 4;
            this.player2.amber = 5;
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 0 amber when player1 has keys but opponent does not', function () {
            this.player1.amber = 3;
            this.player2.amber = 5;
            this.player1.keys = { red: true, blue: true, yellow: false };
            this.player2.player.keys = { red: false, blue: false, yellow: false };
            this.player1.play(this.furtiveInvestors);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
