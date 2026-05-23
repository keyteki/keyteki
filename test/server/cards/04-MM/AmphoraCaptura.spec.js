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
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
        });

        it('should ask to replace default bonus icon with capture', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ask to replace enhanced bonus icon with capture', function () {
            this.player1.play(this.ancientBear);
            // Amber -> Capture
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);

            // Amber -> Amber
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);

            // Capture
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(2);

            // Draw -> Draw
            expect(this.player1).toHavePrompt('How do you wish to resolve this draw bonus icon?');
            expect(this.player1).toHavePromptButton('draw');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('draw');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not offer to resolve house enhancements when replacing bonus icons with capture', function () {
            this.ancientBear.enhancements = ['capture', 'untamed'];
            this.player1.play(this.ancientBear);
            this.player1.clickCard(this.senatorShrix);
            expect(this.player1).not.toHavePrompt('How do you wish to resolve this untamed icon?');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with house enhancements', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['amphora-captura', 'senator-shrix'],
                    hand: ['ancient-bear']
                },
                player2: {
                    amber: 2
                }
            });

            this.ancientBear.enhancements = ['amber', 'saurian'];
        });

        it('should not replace house enhancements with capture', function () {
            this.player1.playCreature(this.ancientBear);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);
            // Should NOT prompt for house enhancement
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with two Amphora Capturas', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['amphora-captura', 'amphora-captura', 'senator-shrix'],
                    hand: ['dust-pixie']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('offers each Amphora as a separate capture source and does not cycle', function () {
            this.player1.play(this.dustPixie);

            // First amber icon - both Amphoras are offered as distinct capture sources.
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1.currentButtons[0]).toBe('amber');
            expect(this.player1.currentButtons[1]).toBe('capture (Amphora Captura)');
            expect(this.player1.currentButtons[2]).toBe('capture (Amphora Captura)');
            this.player1.clickPrompt('capture (Amphora Captura)');
            this.player1.clickCard(this.senatorShrix);

            // Second amber icon - both Amphoras are again available
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber bonus icon?');
            expect(this.player1.currentButtons[0]).toBe('amber');
            expect(this.player1.currentButtons[1]).toBe('capture (Amphora Captura)');
            expect(this.player1.currentButtons[2]).toBe('capture (Amphora Captura)');
            this.player1.clickPrompt('amber');

            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
