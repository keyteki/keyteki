describe('Restringuntus', function () {
    describe("Restringuntus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['restringuntus']
                },
                player2: {
                    inPlay: ['sequis', 'troll', 'tocsin'],
                    discard: ['pitlord']
                }
            });
            this.player1.play(this.restringuntus);
        });

        it('should prompt the player to choose a house', function () {
            expect(this.player1).toHavePrompt('Restringuntus');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
        });

        it('should not allow the other player to pick the house picked', function () {
            this.player1.clickPrompt('brobnar');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('sanctum');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('brobnar');
        });

        it('should not cause an issue if an off-house is chosen', function () {
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('sanctum');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
        });

        it('should override pitlord if it is in play', function () {
            this.player2.moveCard(this.pitlord, 'play area');
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('sanctum');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
        });
    });
});
