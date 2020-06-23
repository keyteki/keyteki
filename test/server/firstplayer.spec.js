describe('First Player effects', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'setup',
            player1: {
                hand: ['zorg', 'mindwarper', 'soft-landing']
            },
            player2: {
                inPlay: []
            }
        });
        this.player1.clickPrompt('mars');
    });

    it('should not allow FP to play a second card after a creature', function () {
        this.player1.play(this.zorg);
        this.player1.clickCard(this.mindwarper);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        this.player1.clickCard(this.softLanding);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });

    it('should not allow FP to play a second card after an action', function () {
        this.player1.play(this.softLanding);
        this.player1.clickCard(this.mindwarper);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        this.player1.clickCard(this.zorg);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });

    it('should not allow FP to play a second card after a discard', function () {
        this.player1.clickCard(this.zorg);
        this.player1.clickPrompt('Discard this card');
        expect(this.zorg.location).toBe('discard');
        this.player1.clickCard(this.mindwarper);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        this.player1.clickCard(this.softLanding);
        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
    });
});
