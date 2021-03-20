describe('Reap Or Sow', function () {
    describe("Reap Or Sow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['bring-low', 'lord-golgotha', 'reap-or-sow'],
                    inPlay: ['dust-pixie', 'sequis']
                },
                player2: {
                    inPlay: ['troll', 'snufflegator'],
                    amber: 1
                }
            });
        });

        it('should prompt with 2 choices', function () {
            this.player1.play(this.reapOrSow);
            expect(this.player1).toHavePromptButton('Ready and reap');
            expect(this.player1).toHavePromptButton('Give power counters');
        });

        it('should allow any friendly creature to ready and reap', function () {
            this.player1.reap(this.dustPixie);
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Ready and reap');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(2);
        });

        it('should allow giving out 3 power counters', function () {
            this.player1.play(this.reapOrSow);
            this.player1.clickPrompt('Give power counters');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.dustPixie.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(1);
        });
    });
});
