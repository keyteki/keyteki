describe('Unguarded Camp', function () {
    describe("Unguarded Camp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: ['valdr', 'krump', 'headhunter', 'unguarded-camp']
                },
                player2: {
                    amber: 3,
                    inPlay: ['snufflegator']
                }
            });
        });

        it('should not trigger when the player has equal creatures', function () {
            this.player1.play(this.unguardedCamp);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should trigger and prompt the player to choose creatures to capture', function () {
            this.player1.play(this.valdr);
            this.player1.play(this.krump);
            this.player1.play(this.headhunter);
            this.player1.play(this.unguardedCamp);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Unguarded Camp');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.headhunter);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.valdr);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.krump);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.valdr.tokens.amber).toBe(1);
            expect(this.troll.tokens.amber).toBe(1);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should only allow stealing amber the opponent has', function () {
            this.player2.amber = 1;
            this.player1.play(this.valdr);
            this.player1.play(this.krump);
            this.player1.play(this.headhunter);
            this.player1.play(this.unguardedCamp);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Unguarded Camp');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.headhunter);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.valdr);
            expect(this.valdr.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
