describe('CorpulentColle', function () {
    describe('test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['corpulent-colle']
                },
                player2: {
                    amber: 6
                }
            });
        });

        describe('play with 6A', function () {
            beforeEach(function () {
                this.player1.play(this.corpulentColle);
            });

            it('capture all A and do damage', function () {
                expect(this.corpulentColle.amber).toBe(6);
                expect(this.corpulentColle.tokens.damage).toBe(6);
            });
        });

        describe('play with 7A', function () {
            beforeEach(function () {
                this.player2.amber = 7;
                this.player1.play(this.corpulentColle);
            });

            it('capture all A and do damage and kill itself', function () {
                expect(this.corpulentColle.location).toBe('discard');
                expect(this.player2.amber).toBe(7);
            });
        });
    });
});
