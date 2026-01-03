describe('Chaos Imp', function () {
    describe("Chaos Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    hand: ['draining-touch'],
                    inPlay: ['chaos-imp']
                },
                player2: {
                    amber: 3,
                    hand: ['punch']
                }
            });
        });

        it('should make opponent lose 1 amber when destroyed and opponent has amber', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.chaosImp);
            expect(this.chaosImp.location).toBe('discard');
            expect(this.player2.amber).toBe(2); // 3 - 1 = 2
            expect(this.player1.amber).toBe(1); // Unchanged
            this.expectReadyToTakeAction(this.player1);
        });

        it('should archive itself when destroyed and opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.chaosImp);
            expect(this.chaosImp.location).toBe('archives');
            expect(this.player2.amber).toBe(0); // Still 0
            expect(this.player1.amber).toBe(1); // Unchanged
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work correctly when opponent has exactly 1 amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.chaosImp);
            expect(this.chaosImp.location).toBe('archives');
            expect(this.player2.amber).toBe(0); // 1 - 1 = 0
            expect(this.player1.amber).toBe(1); // Unchanged
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work when destroyed by opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.punch);
            this.player2.clickCard(this.chaosImp);
            expect(this.chaosImp.location).toBe('discard');
            expect(this.player2.amber).toBe(3); // 3 - 1 = 2
            expect(this.player1.amber).toBe(1); // Unchanged
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
