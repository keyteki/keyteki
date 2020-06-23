describe('Throwing Stars', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['throwing-stars'],
                    inPlay: ['ancient-bear', 'odoac-the-patrician']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre', 'bad-penny']
                }
            });
        });

        describe('and bad penny is selected', function () {
            beforeEach(function () {
                this.player1.play(this.throwingStars);
                this.player1.clickCard(this.badPenny);
                this.player1.clickPrompt('done');
            });

            it('should destroy bad penny', function () {
                expect(this.badPenny.location).toBe('hand');
            });

            it('should give 1 amber', function () {
                expect(this.player1.amber).toBe(1);
            });
        });

        describe('and a target with ward is selected and one creature is destroyed', function () {
            beforeEach(function () {
                this.odoacThePatrician.tokens.ward = 1;
                this.player1.play(this.throwingStars);
                this.player1.clickCard(this.badPenny);
                this.player1.clickCard(this.odoacThePatrician);
                this.player1.clickPrompt('done');
            });

            it('should give 1 amber', function () {
                expect(this.player1.amber).toBe(1);
            });
        });
    });
});
