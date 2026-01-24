describe('The Corpulent Collector', function () {
    describe('test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['the-corpulent-collector']
                },
                player2: {
                    amber: 6
                }
            });
        });

        describe('play with 6A', function () {
            beforeEach(function () {
                this.player1.play(this.theCorpulentCollector);
            });

            it('capture all A and do damage', function () {
                expect(this.theCorpulentCollector.amber).toBe(6);
                expect(this.theCorpulentCollector.damage).toBe(6);
            });
        });

        describe('play with 7A', function () {
            beforeEach(function () {
                this.player2.amber = 7;
                this.player1.play(this.theCorpulentCollector);
            });

            it('capture all A and do damage and kill itself', function () {
                expect(this.theCorpulentCollector.location).toBe('discard');
                expect(this.player2.amber).toBe(7);
            });
        });
    });
});
