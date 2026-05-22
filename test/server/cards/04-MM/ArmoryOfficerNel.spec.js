describe('Armory Officer Nel', function () {
    describe("Armory Officer Nel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armory-officer-nel', 'scout-pete'],
                    hand: ['officer-s-blaster']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should draw a card when an upgrade enters play', function () {
            const handSize = this.player1.player.hand.length;
            this.player1.playUpgrade(this.officerSBlaster, this.scoutPete);
            expect(this.officerSBlaster.parent).toBe(this.scoutPete);
            // Hand should be: handSize - 1 (played upgrade) + 1 (Nel draws) = handSize
            expect(this.player1.player.hand.length).toBe(handSize);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not draw a card when upgrade play is cancelled', function () {
            const handSize = this.player1.player.hand.length;
            this.player1.clickCard(this.officerSBlaster);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.officerSBlaster.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(handSize);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
