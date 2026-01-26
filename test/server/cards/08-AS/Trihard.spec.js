describe('Trihard', function () {
    describe("Trihard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['trihard', 'ember-imp']
                },
                player2: {
                    hand: ['troll', 'charette', 'krump', 'anger', 'punch', 'tremor', 'pelf']
                }
            });
        });

        it('should discard one third of each players hand at random (rounding down)', function () {
            this.player1.playCreature(this.trihard);
            // Player1 has 1 card after playing (1/3 = 0), player2 has 7 (7/3 = 2)
            // Only player2 discards, so no order prompt
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1.discard.length).toBe(0);
            expect(this.player2.hand.length).toBe(5);
            expect(this.player2.discard.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Trihard's simultaneous discard order", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['trihard', 'dust-pixie', 'dextre', 'mother']
                },
                player2: {
                    hand: ['troll', 'charette', 'krump']
                }
            });
        });

        it('should allow active player to discard first', function () {
            this.player1.playCreature(this.trihard);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Me');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player2.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow active player to discard second', function () {
            this.player1.playCreature(this.trihard);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Opponent');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player2.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
