describe('Embered Purse', function () {
    describe("Embered Purse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['embered-purse'],
                    inPlay: ['bosun-creen', 'flip-stallard']
                },
                player2: {
                    amber: 5,
                    inPlay: ['han-peregrine', 'troll']
                }
            });
        });

        it('steals 1 for each ready Skyborn creature in play (both players)', function () {
            this.player1.play(this.emberedPurse);
            // bosun-creen, flip-stallard, han-peregrine = 3 ready skyborn creatures
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not count exhausted Skyborn creatures', function () {
            this.bosunCreen.exhausted = true;
            this.hanPeregrine.exhausted = true;
            this.player1.play(this.emberedPurse);
            // only flip-stallard is a ready skyborn
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 0 when no ready Skyborn creatures', function () {
            this.bosunCreen.exhausted = true;
            this.flipStallard.exhausted = true;
            this.hanPeregrine.exhausted = true;
            this.player1.play(this.emberedPurse);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
