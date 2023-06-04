describe('Teamwork', function () {
    describe("Teamwork's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['bubbles', 'teamwork', 'away-team', 'agent-sepdia'],
                    inPlay: ['earthshaker'],
                    token: 'grumpus'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'ged-hammer']
                }
            });
        });

        it('should make a token and archive if more enemy', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.teamwork.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should make a token and not archive if equal creatures', function () {
            this.player1.playCreature(this.awayTeam, true);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.teamwork.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should make a token and not archive if more creatures than enemy', function () {
            this.player1.playCreature(this.agentSepdia, true);
            this.player1.playCreature(this.awayTeam, true);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.teamwork.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
