describe('Aemberfly', function () {
    describe("Aemberfly's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['werewolf-curse'],
                    inPlay: ['æmberfly']
                },
                player2: {
                    amber: 1,
                    inPlay: ['noddy-the-thief']
                }
            });
        });

        it('captures on fight', function () {
            this.player1.fightWith(this.æmberfly, this.noddyTheThief);
            expect(this.player2.amber).toBe(0);
            expect(this.æmberfly.tokens.amber).toBe(1);
        });

        it('moves captures amber to pool on reap', function () {
            this.player1.fightWith(this.æmberfly, this.noddyTheThief);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.æmberfly);
            expect(this.player1.amber).toBe(3);
            expect(this.æmberfly.tokens.amber).toBe(undefined);
            expect(this.player2.amber).toBe(0);
        });
    });
});
