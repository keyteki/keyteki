describe('Mookling', function () {
    describe("Mookling's continuous ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    inPlay: ['mookling']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not impact player 1 from forging a key', function () {
            this.player1.amber = 6;
            expect(this.player1.amber).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('untamed');
            expect(this.player1.amber).toBe(0);
        });

        it('should make player2 key more expensive by 2', function () {
            this.player2.amber = 8;
            expect(this.player2.amber).toBe(8);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player2.amber).toBe(0);
        });

        it('should make player2 key more expensive because of extra power token on Mookling', function () {
            this.mookling.addToken('power');
            expect(this.mookling.powerCounters).toBe(1);
            this.player2.amber = 10;
            expect(this.player2.amber).toBe(10);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this.player2.amber).toBe(1);
        });
    });
});
