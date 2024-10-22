describe("Dodger's 10", function () {
    describe("Dodger's 10's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['dodger-s-10', 'dodger-s-102']
                },
                player2: {
                    amber: 11,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.dodgerS102, 'discard');
            this.player1.clickCard(this.dodgerS10);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.dodgerS10, 'discard');
            this.player1.clickCard(this.dodgerS102);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.dodgerS10);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.dodgerS102);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to steal half opponent amber on play', function () {
            this.player1.playCreature(this.dodgerS10);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to steal half opponent amber on reap', function () {
            this.player1.playCreature(this.dodgerS10);
            this.player1.amber = 1;
            this.player2.amber = 8;
            this.dodgerS10.exhausted = false;
            this.player1.reap(this.dodgerS10);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to steal half opponent amber on fight', function () {
            this.player1.playCreature(this.dodgerS10);
            this.player1.amber = 1;
            this.player2.amber = 8;
            this.dodgerS10.exhausted = false;
            this.player1.fightWith(this.dodgerS10, this.lamindra);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
