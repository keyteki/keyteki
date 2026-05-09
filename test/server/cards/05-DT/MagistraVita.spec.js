describe('Magistra Vita', function () {
    describe("Magistra Vita's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['shooler', 'senator-shrix'],
                    hand: ['magistra-vita']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.play(this.magistraVita);
        });

        it('should be optional', function () {
            expect(this.player1).toHavePromptButton('Done');
        });

        it('should be able to exalt and reap a non-saurian friendly creature', function () {
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.magistraVita);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.shooler);
            expect(this.player1.amber).toBe(5);
            expect(this.shooler.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Magistra Vita's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['magistra-vita', 'shooler', 'senator-shrix']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });

            this.player1.reap(this.magistraVita);
        });

        it('should be able to exalt and reap a non-saurian friendly creature', function () {
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.magistraVita);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.shooler);
            expect(this.player1.amber).toBe(6);
            expect(this.shooler.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
