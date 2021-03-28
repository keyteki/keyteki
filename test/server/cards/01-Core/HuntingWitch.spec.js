describe('Hunting Witch', function () {
    describe("Hunting Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['hunting-witch'],
                    hand: ['snufflegator']
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
    });
});
