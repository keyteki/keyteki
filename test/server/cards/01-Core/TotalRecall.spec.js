describe('Total Recall', function () {
    describe("Total Recall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['total-recall'],
                    inPlay: ['mindwarper', 'dextre', 'mother']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should gain amber for each ready creature and return all to hand', function () {
            this.player1.play(this.totalRecall);
            expect(this.player1.amber).toBe(4);
            expect(this.mindwarper.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
            expect(this.mother.location).toBe('hand');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber for exhausted creatures', function () {
            this.dextre.exhausted = true;
            this.mindwarper.exhausted = true;
            this.player1.play(this.totalRecall);
            expect(this.player1.amber).toBe(2);
            expect(this.mindwarper.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
            expect(this.mother.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with no creatures in play', function () {
            this.player1.moveCard(this.mindwarper, 'hand');
            this.player1.moveCard(this.dextre, 'hand');
            this.player1.moveCard(this.mother, 'hand');
            this.player1.play(this.totalRecall);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
