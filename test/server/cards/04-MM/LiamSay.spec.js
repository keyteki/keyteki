describe('Liam Say', function () {
    describe("Liam Say's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['liam-say', 'troll']
                },
                player2: {
                    inPlay: ['flaxia', 'fuzzy-gruen', 'ancient-bear']
                }
            });
        });

        it('at the start of my turn should deal 1D to a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Any reactions to key phase starting?');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.liamSay);
            this.player1.clickCard(this.liamSay);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.tokens.damage).toBe(1);
            this.player1.clickPrompt('shadows');
        });

        it('at the start of my turn should decline deal 1D to a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Any reactions to key phase starting?');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.liamSay);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('shadows');
        });
    });
});
