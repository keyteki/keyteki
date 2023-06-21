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
                    token: 'grumpus',
                    inPlay: ['lamindra'],
                    hand: ['press-gang']
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
            expect(priest1.isToken()).toBe(true);
            expect(priest2.isToken()).toBe(true);
            expect(priest3.isToken()).toBe(true);
            expect(priest1).toBe(this.tidalWave);
            expect(priest2).toBe(this.batdrone);
            expect(priest3).toBe(this.helperBot);
            expect(priest1.name).toBe('Priest');
            expect(priest2.name).toBe('Priest');
            expect(priest3.name).toBe('Priest');
            expect(priest1.exhausted).toBe(true);
            expect(priest2.exhausted).toBe(true);
            expect(priest3.exhausted).toBe(true);
            this.player1.endTurn();
        });

        it('tokens do not ready', function () {
            this.player1.play(this.giltspineSchool);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.giltspineSchool.location).toBe('play area');
            let priest1 = this.player1.inPlay[2];
            let priest2 = this.player1.inPlay[1];
            let priest3 = this.player1.inPlay[0];
            this.player1.endTurn();
            expect(priest1.exhausted).toBe(true);
            expect(priest2.exhausted).toBe(true);
            expect(priest3.exhausted).toBe(true);

            this.player2.clickPrompt('brobnar');
            this.player2.play(this.pressGang);
            this.player2.clickPrompt('Left');
            let grumpus = this.player2.inPlay[0];
            this.player2.endTurn();
            expect(priest1.exhausted).toBe(true);
            expect(priest2.exhausted).toBe(true);
            expect(priest3.exhausted).toBe(true);
            expect(grumpus.exhausted).toBe(true);
        });
    });
});
