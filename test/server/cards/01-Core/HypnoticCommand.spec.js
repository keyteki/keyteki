describe('Hypnotic Command', function () {
    describe("Hypnotic Command's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['hypnotic-command', 'zorg', 'blypyp', 'mindwarper']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should do nothing if no Mars creatures in play', function () {
            this.player1.play(this.hypnoticCommand);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make enemy creatures capture amber for each Mars creature', function () {
            this.player1.play(this.zorg);
            this.player1.play(this.blypyp);
            this.player1.play(this.hypnoticCommand);
            expect(this.player1).toHavePrompt(
                'Choose a creature to capture 1 amber from its controller'
            );
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt(
                'Choose a creature to capture 1 amber from its controller'
            );
            this.player1.clickCard(this.krump);
            expect(this.troll.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should stop capturing if opponent runs out of aember to capture', function () {
            this.player1.play(this.zorg);
            this.player1.play(this.blypyp);
            this.player1.play(this.mindwarper);
            this.player1.play(this.hypnoticCommand);
            expect(this.player1).toHavePrompt(
                'Choose a creature to capture 1 amber from its controller'
            );
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt(
                'Choose a creature to capture 1 amber from its controller'
            );
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(2);
            expect(this.krump.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
