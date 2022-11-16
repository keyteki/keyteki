describe('Giltspine School', function () {
    describe("Giltspine School's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    token: 'priest',
                    inPlay: ['helper-bot', 'daughter', 'batdrone'],
                    hand: ['giltspine-school', 'tidal-wave']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.player1.moveCard(this.helperBot, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.tidalWave, 'deck');
        });

        it('should make 3 token creatures', function () {
            this.player1.play(this.giltspineSchool);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.giltspineSchool.location).toBe('play area');
            let priest1 = this.player1.inPlay[2];
            let priest2 = this.player1.inPlay[1];
            let priest3 = this.player1.inPlay[0];
            expect(priest1.id).toBe('priest');
            expect(priest2.id).toBe('priest');
            expect(priest3.id).toBe('priest');
            expect(priest1.versusCard).toBe(this.tidalWave);
            expect(priest2.versusCard).toBe(this.batdrone);
            expect(priest3.versusCard).toBe(this.helperBot);
            expect(priest1.exhausted).toBe(true);
            expect(priest2.exhausted).toBe(true);
            expect(priest3.exhausted).toBe(true);
            this.player1.endTurn();
        });
    });
});
