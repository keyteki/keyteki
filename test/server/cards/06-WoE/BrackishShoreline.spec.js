describe('Brackish Shoreline', function () {
    describe("Brackish Shoreline's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['brackish-shoreline', 'kaupe', 'hookmaster', 'lamindra']
                },
                player2: {
                    inPlay: ['tunk', 'mindwarper'],
                    hand: ['hypnobeam', 'squawker']
                }
            });
        });

        it('when own creatures fight, at the end of turn, should not ready', function () {
            this.player1.fightWith(this.kaupe, this.mindwarper);
            this.player1.reap(this.hookmaster);
            this.player1.endTurn();

            expect(this.kaupe.exhausted).toBe(true);
            expect(this.hookmaster.exhausted).toBe(false);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('creatures that fight should not be ready at end of turn', function () {
                this.player2.fightWith(this.tunk, this.lamindra);
                this.player2.reap(this.mindwarper);
                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(true);
                expect(this.mindwarper.exhausted).toBe(false);
            });

            it('creatures that fight can be ready during main phase', function () {
                this.player2.fightWith(this.tunk, this.lamindra);
                this.player2.play(this.squawker);
                this.player2.clickCard(this.tunk);

                expect(this.tunk.exhausted).toBe(false);
            });

            it('creatures that reap and fight should not be readied', function () {
                this.player2.reap(this.tunk);
                this.player2.play(this.squawker);
                this.player2.clickCard(this.tunk);
                this.player2.fightWith(this.tunk, this.lamindra);
                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(true);
            });

            it('should last for one round only', function () {
                this.player2.reap(this.tunk);
                this.player2.fightWith(this.mindwarper, this.lamindra);
                this.player2.endTurn();

                this.player1.clickPrompt('unfathomable');
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.endTurn();

                expect(this.tunk.exhausted).toBe(false);
                expect(this.mindwarper.exhausted).toBe(false);
            });
        });
    });
});
