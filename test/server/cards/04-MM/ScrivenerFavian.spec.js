describe('Scrivener Favian', function () {
    describe("Scrivener Favian's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['scrivener-favian', 'senator-shrix'],
                    hand: ['fertility-chant', 'dust-pixie', 'wild-bounty']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });
        });

        it('should not trigger if no bonus', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
        });

        it('should not trigger if no capture', function () {
            this.player1.play(this.fertilityChant);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(4);
        });

        it('should ask to replace capture with steal, and capture, if selected', function () {
            this.dustPixie.cardData.enhancements = ['amber', 'capture', 'draw'];
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this capture icon?');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ask to replace capture with steal, and steal, if selected', function () {
            this.dustPixie.cardData.enhancements = ['amber', 'capture', 'draw'];
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this capture icon?');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('steal');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Scrivener Favian's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['scrivener-favian', 'senator-shrix', 'amphora-captura'],
                    hand: ['fertility-chant', 'dust-pixie', 'wild-bounty']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 6
                }
            });
        });

        it('should interact with Amphora Captura and convert every bonus to steal, when selected, but still keep original options', function () {
            this.dustPixie.cardData.enhancements = ['amber', 'capture', 'draw'];
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('steal');
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('steal');
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('steal');
            expect(this.player1).toHavePrompt('How do you wish to resolve this capture icon?');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.senatorShrix);
            expect(this.player1).toHavePrompt('How do you wish to resolve this draw icon?');
            expect(this.player1).toHavePromptButton('draw');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('steal');
            this.player1.clickPrompt('draw');

            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
