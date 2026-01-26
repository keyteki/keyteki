describe('Recklessness', function () {
    describe("Recklessness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['recklessness', 'auction-off', 'mass-buyout']
                },
                player2: {
                    amber: 1,
                    hand: ['stealth-mode', 'timetraveller', 'rogue-operation']
                }
            });
        });

        it('each player discards 3 and draws 3', function () {
            this.player1.play(this.recklessness);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.auctionOff.location).toBe('discard');
            expect(this.massBuyout.location).toBe('discard');
            expect(this.stealthMode.location).toBe('discard');
            expect(this.timetraveller.location).toBe('discard');
            expect(this.rogueOperation.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Recklessness's simultaneous discard order", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['recklessness', 'auction-off', 'mass-buyout', 'daughter']
                },
                player2: {
                    amber: 1,
                    hand: ['stealth-mode', 'timetraveller', 'rogue-operation', 'urchin']
                }
            });
        });

        it('should allow active player to choose to discard first', function () {
            this.player1.play(this.recklessness);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Me');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow active player to choose to discard second', function () {
            this.player1.play(this.recklessness);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Opponent');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
