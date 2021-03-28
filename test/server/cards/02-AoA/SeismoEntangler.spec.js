describe('Seismo-Entangler', function () {
    describe("Seismo-Entangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['seismo-entangler', 'dextre']
                },
                player2: {
                    house: 'logos',
                    inPlay: ['bumpsy', 'batdrone']
                }
            });
        });
        it('should prompt to choose a house', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
        });
        it('should not prevent its own creatures from reaping with logos', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.dextre);
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
        it('should prevent its opponent from reaping with logos', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.batdrone);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
        });

        it('should not prevent its opponent from reaping with brobnar', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.bumpsy);
            expect(this.player2).toHavePromptButton('Reap with this creature');
        });
    });
});
