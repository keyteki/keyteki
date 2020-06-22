describe('Gleeful Mayhem', function () {
    describe('the ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    hand: ['gleeful-mayhem', 'troll'],
                    inPlay: []
                },
                player2: {
                    inPlay: ['shadow-self']
                }
            });
        });

        it('should only be able to select cards from houses in play', function () {
            this.player1.play(this.gleefulMayhem);

            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
        });

        it('should deal 5 damage to the first card selected', function () {
            this.player1.play(this.gleefulMayhem);

            this.player1.clickCard(this.shadowSelf);

            expect(this.shadowSelf.tokens.damage).toBe(5);
        });

        describe('when more than 1 creature is in play', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                this.player1.clickPrompt('brobnar');
                this.player1.playCreature(this.troll);

                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                this.player1.clickPrompt('dis');
                this.player1.play(this.gleefulMayhem);
            });

            it('should prompt to deal damage to brobnar first', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.shadowSelf);
            });

            it('should prompt to deal damage to shadows next', function () {
                this.player1.clickCard(this.troll);

                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            });

            it('should deal damage to all creatures selected', function () {
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.shadowSelf);

                expect(this.shadowSelf.tokens.damage).toBe(5);
                expect(this.troll.tokens.damage).toBe(5);
            });
        });
    });
});
