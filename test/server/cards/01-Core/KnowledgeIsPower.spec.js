describe('Knowledge is Power', function () {
    describe("Knowledge is Power's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['knowledge-is-power', 'dextre', 'batdrone'],
                    archives: ['troll', 'krump']
                },
                player2: {}
            });
        });

        it('should allow archiving a card from hand', function () {
            this.player1.play(this.knowledgeIsPower);
            this.player1.clickPrompt('Archive a card');
            expect(this.player1).toHavePrompt('Knowledge is Power');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain amber equal to archived cards', function () {
            this.player1.play(this.knowledgeIsPower);
            this.player1.clickPrompt('Gain amber');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
