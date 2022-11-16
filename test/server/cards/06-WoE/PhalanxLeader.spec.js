describe('Phalanx Leader', function () {
    describe("Phalanx Leader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    token: 'senator',
                    inPlay: ['helper-bot', 'daughter'],
                    hand: ['phalanx-leader']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.player1.moveCard(this.helperBot, 'deck');
        });

        it('when played on left flank, should make a token creature and place it on its left side', function () {
            this.player1.play(this.phalanxLeader, true);
            let senator = this.player1.inPlay[0];
            expect(senator.id).toBe('senator');
            expect(senator.versusCard).toBe(this.helperBot);
            expect(senator.exhausted).toBe(true);
            expect(this.player1.inPlay[1]).toBe(this.phalanxLeader);
            expect(this.player1.inPlay[2]).toBe(this.daughter);
            this.player1.endTurn();
        });

        it('when played on right flank, should make a token creature and place it on its left side', function () {
            this.player1.play(this.phalanxLeader, false);
            let senator = this.player1.inPlay[1];
            expect(senator.id).toBe('senator');
            expect(senator.versusCard).toBe(this.helperBot);
            expect(senator.exhausted).toBe(true);
            expect(this.player1.inPlay[2]).toBe(this.phalanxLeader);
            expect(this.player1.inPlay[0]).toBe(this.daughter);
            this.player1.endTurn();
        });
    });
});
