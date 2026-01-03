describe('Amphora Captura', function () {
    describe("Amphora Captura's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['amphora-captura', 'senator-shrix'],
                    hand: ['fertility-chant', 'dust-pixie', 'wild-bounty', 'ancient-bear']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });

            this.ancientBear.enhancements = ['amber', 'amber', 'capture', 'draw'];
        });

        it('should not trigger if no bonus', function () {
            this.player1.play(this.wildBounty);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.amber).toBe(0);
        });

        it('should ask to replace default bonus icon with capture', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should ask to replace enhanced bonus icon with capture', function () {
            this.player1.play(this.ancientBear);
            // Amber -> Capture
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);

            // Amber -> Amber
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);

            // Capture
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(2);

            // Draw -> Draw
            expect(this.player1).toHavePrompt('How do you wish to resolve this draw icon?');
            expect(this.player1).toHavePromptButton('draw');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('draw');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
