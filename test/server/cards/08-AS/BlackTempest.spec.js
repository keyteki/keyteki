describe('Black Tempest', function () {
    describe("Black Tempest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    inPlay: ['black-tempest']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should steal 3 on fight with no forged keys', function () {
            this.player1.fightWith(this.blackTempest, this.lamindra);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should steal 2 on fight with 1 forged key', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.blackTempest, this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should steal 2 on fight with 2 forged keys', function () {
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player1.fightWith(this.blackTempest, this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
