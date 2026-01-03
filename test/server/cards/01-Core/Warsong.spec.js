describe('Warsong', function () {
    describe("Warsong's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['warsong', 'harland-mindlock', 'anger'],
                    inPlay: ['troll', 'krump']
                },
                player2: {
                    inPlay: ['lamindra', 'brain-eater']
                }
            });
            this.harlandMindlock.maverick = 'brobnar';
            this.harlandMindlock.printedHouse = 'brobnar';
        });

        it('should gain 1 amber for each fight', function () {
            this.player1.play(this.warsong);
            expect(this.player1.amber).toBe(0);
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.krump, this.brainEater);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain amber when opponent creature fights', function () {
            this.player1.play(this.warsong);
            expect(this.player1.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain amber from fights on the next turn', function () {
            this.player1.play(this.warsong);
            expect(this.player1.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.krump, this.brainEater);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain amber from creatures you take control of and die in fight', function () {
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Right');
            this.player1.play(this.warsong);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.anger);
            this.player1.clickCard(this.lamindra); // will die in fight, reverting control in the discard
            this.player1.clickCard(this.brainEater); // fight
            expect(this.player1.amber).toBe(2); // 1 for anger + 1 for warsong fight
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
