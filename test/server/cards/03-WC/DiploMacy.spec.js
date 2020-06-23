describe('Diplo-Macy', function () {
    describe("Diplo-Macy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['diplo-macy'],
                    inPlay: ['grimlocus-dux', 'philophosaurus', 'tezmal']
                },
                player2: {
                    inPlay: ['redlock', 'lamindra']
                }
            });
        });

        it('should add before fight effect until start of next turn', function () {
            this.player1.play(this.diploMacy);
            this.player1.fightWith(this.grimlocusDux, this.lamindra);
            expect(this.grimlocusDux.amber).toBe(1);
            this.player1.fightWith(this.philophosaurus, this.redlock);
            expect(this.philophosaurus.amber).toBe(1);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.lamindra, this.tezmal);
            expect(this.lamindra.amber).toBe(1);
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.fightWith(this.tezmal, this.lamindra);
            expect(this.tezmal.amber).toBe(0);
            this.player1.endTurn();
        });
    });
});
