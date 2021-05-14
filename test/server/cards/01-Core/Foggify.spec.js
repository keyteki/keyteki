describe('Foggify', function () {
    describe("Foggify's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre'],
                    hand: ['foggify']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });

            this.player1.play(this.foggify);
        });

        it('own creatures should be able to fight', function () {
            this.player1.fightWith(this.dextre, this.emberImp);
            expect(this.dextre.tokens.damage).toBe(2);
            expect(this.emberImp.location).toBe('discard');
        });

        it('creature not should be able to fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });

        it('should last for one turn only', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
        });
    });
});
