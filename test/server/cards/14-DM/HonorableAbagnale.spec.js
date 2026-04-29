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
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).not.toHavePromptButton('0');
            expect(this.player1).not.toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('3');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('player can choose to take less than the maximum from opponent pool', function () {
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
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1).isReadyToTakeAction();
        });

        it('takes only as much as is available from opponent pool', function () {
            this.player1.amber = 6;
            this.player2.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('1');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not take from opponent pool without Abagnale in play', function () {
            this.player1.moveCard(this.honorableAbagnale, 'discard');
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

        it('stacks: maximum from opponent pool becomes 6 (3 per Abagnale)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            // 4 own + need 2 more. Each Abagnale prompts 0..3 but combined min is 2.
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            // First Abagnale: max 3, other Abagnale can also cover up to 3
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('1');

            // Second Abagnale: still need 1 from pool
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).not.toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('1');
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forces 3 from each Abagnale when 6 are needed and opponent has 6', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 0,
                    inPlay: ['honorable-abagnale', 'honorable-abagnale']
                },
                player2: {
                    amber: 12
                }
            });
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows 0 or 1 per Abagnale when no extra amber is required and opponent has 1', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 6,
                    inPlay: ['honorable-abagnale', 'honorable-abagnale']
                },
                player2: {
                    amber: 1
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt(
                "How much amber do you want to take from your opponent's pool?"
            );
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('1');
            // Second Abagnale: opponent now has 0, no prompt, auto-takes 0.
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
