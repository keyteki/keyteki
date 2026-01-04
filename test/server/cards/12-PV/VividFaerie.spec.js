describe('Vivid Faerie', function () {
    describe("Vivid Faerie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    inPlay: ['vivid-faerie', 'ember-imp', 'dust-pixie'],
                    hand: ['dew-faerie']
                },
                player2: {
                    inPlay: ['chonkers']
                }
            });
        });

        it('should gain 1 amber for 1 untamed neighbor when reaping', function () {
            this.player1.playCreature(this.dewFaerie, true);
            this.player1.reap(this.vividFaerie);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2 amber for 2 untamed neighbors when reaping', function () {
            this.player1.playCreature(this.dewFaerie, true);
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.reap(this.vividFaerie);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber for non-untamed neighbors', function () {
            this.player1.reap(this.vividFaerie);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
