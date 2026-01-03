describe('Cultural Exchange', function () {
    describe("Cultural Exchange's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['pelf'],
                    hand: ['cultural-exchange']
                },
                player2: {
                    inPlay: ['uxlyx-the-zookeeper'],
                    archives: ['troll', 'batdrone']
                }
            });
        });

        it('return enemy archives to hand', function () {
            this.player1.play(this.culturalExchange);
            expect(this.player2.hand.length).toBe(2);
            expect(this.troll.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player1.amber).toBe(2);
        });

        it('return friendly cards to my hand', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.clickPrompt('No');
            this.player2.reap(this.uxlyxTheZookeeper);
            this.player2.clickCard(this.pelf);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');

            this.player1.play(this.culturalExchange);
            expect(this.player2.hand).toContain(this.troll);
            expect(this.player2.hand).toContain(this.batdrone);
            expect(this.player1.hand).toContain(this.pelf);
        });

        it('does nothing when archive empty', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.clickPrompt('Yes');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.culturalExchange);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
