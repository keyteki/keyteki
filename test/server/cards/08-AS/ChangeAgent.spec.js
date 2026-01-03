describe('Change Agent', function () {
    describe("Change Agents's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['change-agent']
                },
                player2: {
                    amber: 4,
                    hand: [
                        'lamindra',
                        'umbra',
                        'too-much-to-protect',
                        'swindle',
                        'anger',
                        'hire-on',
                        'troll'
                    ],
                    inPlay: ['old-bruno']
                }
            });
        });

        it('should cause opponent to lose amber on reap', function () {
            this.player1.reap(this.changeAgent);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should cause opponent to lose amber on fight', function () {
            this.player1.fightWith(this.changeAgent, this.oldBruno);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing if opponent has 5 or fewer cards', function () {
            this.player2.moveCard(this.lamindra, 'discard');
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.tooMuchToProtect, 'discard');
            this.player1.reap(this.changeAgent);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
