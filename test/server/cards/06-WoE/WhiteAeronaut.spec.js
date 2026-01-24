describe('White Aeronaut', function () {
    describe("White Aeronaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['tunk', 'nautilixian', 'white-aeronaut']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('should cause the nautilixian to heal and ward', function () {
            this.player1.reap(this.tunk);
            this.player1.fightWith(this.nautilixian, this.troll);
            expect(this.nautilixian.damage).toBe(4);
            this.player1.useAction(this.whiteAeronaut);
            this.player1.clickCard(this.nautilixian);
            expect(this.nautilixian.damage).toBe(0);
            expect(this.nautilixian.tokens.ward).toBe(1);
        });
    });
});
