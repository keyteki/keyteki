describe('Nerotaurus', function () {
    describe("Nerotaurus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['nerotaurus', 'galeatops'],
                    amber: 1
                },
                player2: {
                    inPlay: ['troll', 'brammo', 'guji-dinosaur-hunter']
                }
            });
        });

        it('opponent should not be allowed to fight next turn', function () {
            this.player1.reap(this.nerotaurus);
            this.player1.fightWith(this.galeatops, this.brammo);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gujiDinosaurHunter);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton("Use this card's Action ability");
        });

        it('opponent should not be allowed to reap next turn', function () {
            this.player1.fightWith(this.nerotaurus, this.brammo);
            this.player1.reap(this.galeatops);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gujiDinosaurHunter);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton("Use this card's Action ability");
        });

        it("'no fight' effect should last for a single turn only", function () {
            this.player1.reap(this.nerotaurus);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gujiDinosaurHunter);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton("Use this card's Action ability");
        });

        it("'no reap' effect should last for a single turn only", function () {
            this.player1.fightWith(this.nerotaurus, this.brammo);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gujiDinosaurHunter);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton("Use this card's Action ability");
        });
    });
});
