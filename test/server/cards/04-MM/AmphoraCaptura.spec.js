describe('Amphora Captura', function () {
    describe("Amphora Captura's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['amphora-captura', 'senator-shrix'],
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
