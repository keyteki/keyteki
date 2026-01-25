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
                this.odoacThePatrician.ward();
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

    describe('on a target with armageddon cloak', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['lamindra'],
                    hand: ['armageddon-cloak']
                },
                player2: {
                    hand: ['throwing-stars'],
                    inPlay: ['ancient-bear', 'odoac-the-patrician']
                }
            });

            this.player1.playUpgrade(this.armageddonCloak, this.lamindra);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
        });

        it('should destroy the cloak and not gain 1 amber', function () {
            this.player2.play(this.throwingStars);
            this.player2.clickCard(this.lamindra);
            this.player2.clickPrompt('done');
            expect(this.lamindra.location).toBe('play area');
            expect(this.armageddonCloak.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
        });
    });
});
