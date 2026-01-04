describe('AncestralTimekeeper', function () {
    describe("Ancestral Timekeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    inPlay: ['ancestral-timekeeper'],
                    discard: ['ancestral-timekeeper']
                },
                player2: {
                    amber: 5,
                    discard: ['thing-from-the-deep']
                }
            });
            this.ancestralTimekeeper2 = this.player1.discard[0];
        });

        it('adds a time counter at end of turn', function () {
            this.player1.endTurn();
            expect(this.ancestralTimekeeper.tokens.time).toBe(1);
            expect(this.ancestralTimekeeper.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('adds a time counter to each friendly clock at end of turn', function () {
            this.player1.moveCard(this.ancestralTimekeeper2, 'hand');
            this.player1.playCreature(this.ancestralTimekeeper2);
            this.player1.endTurn();
            this.player1.clickCard(this.ancestralTimekeeper);
            expect(this.ancestralTimekeeper.tokens.time).toBe(2);
            expect(this.ancestralTimekeeper2.tokens.time).toBe(2);
            expect(this.ancestralTimekeeper.location).toBe('play area');
            expect(this.ancestralTimekeeper2.location).toBe('play area');
            this.player2.clickPrompt('unfathomable');
        });

        it('purges self with 12 time counters at end of turn and takes another turn', function () {
            this.ancestralTimekeeper.tokens.time = 11;
            this.player1.endTurn();
            expect(this.ancestralTimekeeper.location).toBe('purged');
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
