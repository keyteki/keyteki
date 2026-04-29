describe('Amberfin Shark Evil Twin', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['æmberfin-shark-evil-twin']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should do nothing if both players have no amber', function () {
            expect(this.æmberfinSharkEvilTwin.location).toBe('play area');
            this.player1.amber = 0;
            expect(this.player1.amber).toBe(0);
            this.player2.amber = 0;
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(0);
        });

        it('should cause player 1 to lose one A and gain 1 power', function () {
            this.player1.amber = 2;
            expect(this.player1.amber).toBe(2);
            this.player2.amber = 0;
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(1);
        });

        it('should cause player 2 to lose one A and gain 1 power', function () {
            this.player1.amber = 0;
            expect(this.player1.amber).toBe(0);
            this.player2.amber = 2;
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(1);
        });

        it('should cause both players 1 to lose one A and gain 2 power', function () {
            this.player1.amber = 2;
            expect(this.player1.amber).toBe(2);
            this.player2.amber = 2;
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(2);
        });

        it('should only trigger at the end of the controllers turn', function () {
            this.player1.amber = 3;
            expect(this.player1.amber).toBe(3);
            this.player2.amber = 3;
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(2);

            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.æmberfinSharkEvilTwin.powerCounters).toBe(2);
        });
    });
});
