describe('Transmutation', function () {
    describe("Transmutation's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['transmutation'],
                    inPlay: ['iyxrenu-the-clever', 'john-smyth']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        it('adds 2 power counters to a creature, then optionally removes counters to capture', function () {
            this.player1.play(this.transmutation);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.iyxrenuTheClever.powerCounters).toBe(2);
            // Choose friendly creature to remove counters from
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.iyxrenuTheClever);
            this.player1.clickPrompt('2');
            expect(this.iyxrenuTheClever.powerCounters).toBe(0);
            // captures 2A from opponent
            expect(this.iyxrenuTheClever.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('may decline to remove counters when no friendly creature has counters', function () {
            this.player1.play(this.transmutation);
            this.player1.clickCard(this.troll);
            expect(this.troll.powerCounters).toBe(2);
            // No friendly creature has +1 counters → optional auto-skips
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
