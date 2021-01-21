describe('Dry the River', function () {
    describe("Dry the River's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'unfathomable',
                    inPlay: ['dry-the-river', 'abyssal-zealot']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            it('own creatures should be able to reap', function () {
                this.player1.clickCard(this.abyssalZealot);
                expect(this.player1).toHavePromptButton('Reap with this creature');
            });

            it('opponent creatures should be able to reap', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.clickCard(this.murkens);
                expect(this.player2).toHavePromptButton('Reap with this creature');
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('own creatures should be able to reap', function () {
                this.player1.clickCard(this.abyssalZealot);
                expect(this.player1).toHavePromptButton('Reap with this creature');
            });

            it('opponent creatures should not be able to reap', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.clickCard(this.murkens);
                expect(this.player2).not.toHavePromptButton('Reap with this creature');
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('own creatures should not be able to reap', function () {
                this.player1.clickCard(this.abyssalZealot);
                expect(this.player1).not.toHavePromptButton('Reap with this creature');
            });

            it('opponent creatures should be able to reap', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.clickCard(this.murkens);
                expect(this.player2).toHavePromptButton('Reap with this creature');
            });
        });
    });
});
