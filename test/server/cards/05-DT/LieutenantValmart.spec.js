describe('Lieutenant Valmart', function () {
    describe("Lieutenant Valmart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['lieutenant-valmart']
                },
                player2: {
                    amber: 10,
                    inPlay: ['murkens']
                }
            });
        });

        it('should not increase key cost +3 if tide is neutral after play', function () {
            this.player1.moveCard(this.lieutenantValmart, 'hand');
            this.player1.play(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should not increase key cost +3 if tide is low after play', function () {
            this.player1.moveCard(this.lieutenantValmart, 'hand');
            this.player2.changeTide('high');
            this.player1.play(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should increase key cost +3 if tide is high after play', function () {
            this.player1.moveCard(this.lieutenantValmart, 'hand');
            this.player1.raiseTide();
            this.player1.play(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(1);
        });

        it('should not increase key cost +3 if tide is neutral after reap', function () {
            this.player1.reap(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should not increase key cost +3 if tide is low after reap', function () {
            this.player2.changeTide('high');
            this.player1.reap(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should increase key cost +3 if tide is high after reap', function () {
            this.player1.raiseTide();
            this.player1.reap(this.lieutenantValmart);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(1);
        });

        it('should not increase key cost +3 if tide is neutral after fight', function () {
            this.player1.fightWith(this.lieutenantValmart, this.murkens);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should not increase key cost +3 if tide is low after fight', function () {
            this.player2.changeTide('high');
            this.player1.fightWith(this.lieutenantValmart, this.murkens);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should increase key cost +3 if tide is high after fight', function () {
            this.player1.raiseTide();
            this.player1.fightWith(this.lieutenantValmart, this.murkens);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(1);
        });
    });
});
