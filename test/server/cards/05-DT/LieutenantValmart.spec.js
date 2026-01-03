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
            this.player1.lowerTide();
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
            this.player1.lowerTide();
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
            this.player1.lowerTide();
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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'staralliance',
                    hand: ['lieutenant-valmart'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'staralliance';
            this.tachyonManifold.printedHouse = 'staralliance';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.raiseTide();
            this.player1.play(this.lieutenantValmart);
            this.player1.endTurn();
            this.player1.clickPrompt('staralliance');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            this.player2.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
