describe('Daughter', function () {
    describe('Play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['daughter', 'troll']
                },
                player2: {
                    inPlay: ['umbra', 'nexus']
                }
            });
        });

        it("increases the draw size of it's controller by 1", function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(7);
        });

        it("increases the draw size of it's controller by 1 with 1 chain", function () {
            this.player1.chains = 1;
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(6);
        });

        it("increases the draw size of it's controller by 1 with 7 chains", function () {
            this.player1.chains = 7;
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(5);
        });
    });
});
