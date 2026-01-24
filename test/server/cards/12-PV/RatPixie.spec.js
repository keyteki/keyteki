describe('Rat Pixie', function () {
    describe("Rat Pixie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    hand: ['rat-pixie'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should gain 1 amber when played with 4 or fewer amber', function () {
            this.player1.play(this.ratPixie);
            expect(this.player1.amber).toBe(3);
        });

        it('should not gain amber when played with more than 4 amber', function () {
            this.player1.amber = 5;
            this.player1.play(this.ratPixie);
            expect(this.player1.amber).toBe(5);
        });

        it('should gain 1 amber when reaping with 4 or fewer amber', function () {
            this.player1.moveCard(this.ratPixie, 'play area');
            this.ratPixie.ready();
            this.player1.reap(this.ratPixie);
            expect(this.player1.amber).toBe(4);
        });

        it('should not gain amber when reaping with more than 4 amber', function () {
            this.player1.moveCard(this.ratPixie, 'play area');
            this.ratPixie.ready();
            this.player1.amber = 5;
            this.player1.reap(this.ratPixie);
            expect(this.player1.amber).toBe(6);
        });
    });
});
