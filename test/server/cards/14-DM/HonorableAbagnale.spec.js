describe('Honorable Abagnale', function () {
    describe("Honorable Abagnale's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 4,
                    inPlay: ['honorable-abagnale']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('lets player forge a key by spending up to 3 from opponent pool', function () {
            // 4 own + up to 3 from opponent (=5 available) >= 6
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            // Now player1's key phase: prompted for amount from opponent pool.
            // Must forge if able: minimum is 2 (so 4 + 2 = 6 cost), max is 3.
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).not.toHavePromptButton('0');
            expect(this.player1).not.toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            this.player1.clickPrompt('3');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('player can choose to take less than the maximum from opponent pool', function () {
            // 4 own + 2 from opponent = 6 (exactly cost)
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('2');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot forge if combined amber is still less than cost', function () {
            this.player1.amber = 2;
            this.player2.amber = 1;
            // 2 + min(3,1)=1 = 3 < 6
            expect(this.player1.player.canForgeKey()).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('takes only as much as is available from opponent pool', function () {
            this.player1.amber = 6;
            this.player2.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            // Pool has only 1 amber and player can pay full cost themselves (6),
            // so the choice prompt covers 0..1.
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            this.player1.clickPrompt('1');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            // Cost 6: opponent pool covers 1, player covers 5
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not take from opponent pool without Abagnale in play', function () {
            this.player1.moveCard(this.honorableAbagnale, 'discard');
            // 4 own + 0 from opponent < 6
            expect(this.player1.player.canForgeKey()).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Honorable Abagnale's interaction with other amber sources", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 4,
                    inPlay: ['honorable-abagnale', 'senator-shrix']
                },
                player2: {
                    amber: 5
                }
            });
            // Put 2 amber on Senator Shrix
            this.senatorShrix.amber = 2;
        });

        it('reduces the required minimum from the opponent pool by the amber on Senator Shrix', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            // Cost 6: 4 own + 2 on Shrix + up to 3 from pool. Min from pool is now 0.
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
        });

        it('takes 0 from opponent when the rest is covered by Senator Shrix', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('0');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            // Player paid 4 own + 2 from Shrix = 6
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Two copies of Honorable Abagnale', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 4,
                    inPlay: ['honorable-abagnale', 'honorable-abagnale']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('does not stack: maximum from opponent pool stays at 3', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            expect(this.player1).not.toHavePromptButton('5');
            expect(this.player1).not.toHavePromptButton('6');
            this.player1.clickPrompt('3');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
