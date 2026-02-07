describe('Hunting Witch', function () {
    describe("Hunting Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['hunting-witch'],
                    hand: ['snufflegator', 'flaxia']
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('should trigger when playing a creature', function () {
            this.player1.play(this.snufflegator);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should not trigger when opponent plays a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should not trigger when player clicks Back on flank selection', function () {
            this.player1.play(this.snufflegator);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Back');
            expect(this.player1.amber).toBe(1);
            expect(this.flaxia.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
