describe('Questor Jarta', function () {
    describe("Questor Jarta's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should exalt Questor Jarta and gain 1 amber', function () {
            this.player1.reap(this.questorJarta);

            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.questorJarta);

            expect(this.questorJarta.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
        });

        it('should not gain amber if player does not exalt Questor Jarta', function () {
            this.player1.reap(this.questorJarta);

            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.questorJarta.hasToken('amber')).toBe(false);
            expect(this.player1.amber).toBe(1);
        });
    });
});
