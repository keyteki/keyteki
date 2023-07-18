describe('Uplink', function () {
    describe("Uplink's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['uplink'],
                    inPlay: [
                        'dharna',
                        'agent-sepdia',
                        'flaxia',
                        'bubbles',
                        'colonist-chapman',
                        'away-team'
                    ],
                    token: 'cultist'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should make 2 tokens if all neighbors not star alliance', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            this.player1.playUpgrade(this.uplink, this.agentSepdia);

            this.player1.useAction(this.agentSepdia);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(8);
            this.player1.endTurn();
        });

        it('should make 1 tokens if one neighbor are not star alliance', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            this.player1.playUpgrade(this.uplink, this.colonistChapman);

            this.player1.useAction(this.colonistChapman);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(7);
            this.player1.endTurn();
        });

        it('should make no tokens if all neighbors are star alliance', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            this.player1.playUpgrade(this.uplink, this.awayTeam);
            this.player1.useAction(this.awayTeam);
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            this.player1.endTurn();
        });
    });
});
