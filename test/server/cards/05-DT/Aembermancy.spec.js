describe('Ambermancy', function () {
    describe("Ambermancy' play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['æmbermancy'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should be able to select friendly or enemey creatures', function () {
            this.player1.play(this.æmbermancy);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.krump);
        });

        it('should be able to to choose to remove none, and a max of 3', function () {
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            expect(this.flaxia.powerCounters).toBe(4);
            this.player1.play(this.æmbermancy);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('0');
            expect(this.flaxia.powerCounters).toBe(4);
        });

        it('should remove the number of tokens requested and give aember for that number', function () {
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            this.flaxia.addToken('power');
            expect(this.flaxia.powerCounters).toBe(4);
            this.player1.play(this.æmbermancy);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('2');
            expect(this.flaxia.powerCounters).toBe(2);
            expect(this.player1.amber).toBe(4); // start at 1, 1 for æmbermancy, 2 from effect
        });
    });
});
